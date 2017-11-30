/**
 * @fileOverview CLI class
 * @author Eric Gardner / Getty Publications
 * @license MIT
 *
 */
const EventEmitter = require('events')
const _ = require('lodash')
const chalk = require('chalk')
const execa = require('execa')
const exists = require('command-exists').sync
const frontmatter = require('yaml-front-matter')
const fs = require('fs')
const glob = require('glob')
const path = require('path')
const spawn = require('child_process').spawn
const spawnSync = require('child_process').spawnSync
const { URL } = require('url')
const { readYAML } = require('./utils')

/**
 * Config object.
 * @description Stashing some fixed values as globals here for now.
 */
const CONFIG = {
  STARTER_REPO: 'https://github.com/gettypubs/quire-starter.git',
  CURRENT_VERSION: 'v0.1.0.alpha.1',
  THEME_NAME: 'quire-starter-theme',
  DEFAULT_PROJECT_NAME: 'quire-project',
  LOCALHOST: 'http://localhost:1313'
}

/**
 * CLI class.
 *
 * @extends EventEmitter
 * @description The CLI class is the core of the `quire` program. The class
 * extends Node's [EventEmitter](https://nodejs.org/api/events.html) base class
 * because using an events-based api is useful when respoding to user input --
 * in particular, the user could send a SIGINT signal at any time, and by
 * emitting an event whenever this happens, the Quire instance can make sure
 * to kill any child processes before terminating.
 *
 * Another API which has proven useful in developing this program is the Promise
 * interface. Quire relies on the [execa](https://github.com/sindresorhus/execa)
 * library which provides a promise-based interface to child processes, which
 * makes error-handling and control flow easier to follow.
 */
class CLI extends EventEmitter {
  constructor () {
    super()
    this.currentDir = process.cwd()
    this.on('new', this.create)
    this.on('preview', this.preview)
    this.on('build', this.build)
    this.on('epub', this.epub)
    this.on('pdf', this.pdf)
    this.on('error', this.warn)
    this.once('shutdown', this.shutdown)
  }

  /**
   * Create "projectName"
   *
   * @param {string} projectName Name of the local project directory to be created.
   * @description Sets up a new local Quire project in the desired directory. This command
   * is a wrapper for the underlying shell commands (primarily `git`), which
   * are executed in a promise chain. The user must have the `git` shell
   * commands available on their system to create a new project; this method
   * will emit a warning and exit with code 1 if `git` is not available.
   */
  create (projectName) {
    if (this.commandMissing('git')) {
      this.emit('warning', 'Please install Git before continuing.')
    }

    this.notice('Installing starter kit...')

    // Clone the starter kit and submodules at the target version
    execa('git', ['clone', '--recursive', '--branch', CONFIG.CURRENT_VERSION, CONFIG.STARTER_REPO, projectName])
      .catch((error) => {
        this.error(error.message)
      })
      .then((result) => {
        this.notice('Configuring project...')
        process.chdir(projectName)
        spawnSync('git', ['checkout', '-b', 'master'])
        spawnSync('git', ['remote', 'rm', 'origin'])
        spawnSync('git', ['rm', '.gitmodules'])
        spawnSync('git', ['rm', '--cached', path.join(process.cwd(), 'themes', CONFIG.THEME_NAME)])
      })
      .then(() => {
        this.notice('Setting up theme...')
        process.chdir(`themes/${CONFIG.THEME_NAME}`)
        execa('rm', ['-rf', '.git'])
      })
      .then(() => {
        process.chdir('../..')
        execa('git', ['add', '-A'])
          .then(() => {
            execa('git', ['commit', '-m',
              'Add quire-starter-theme to project'
            ])
          })
      })
      .then(() => {
        this.notice('Installing dependencies...')
        this.npmInstall(path.join(process.cwd(), 'themes', CONFIG.THEME_NAME))
        this.confirm('Theme and dependencies successfully installed.')
        this.notice(
          'Run quire preview in your project folder to view changes locally.'
        )
      })
  }

  /**
   * Preview
   *
   * @description Runs `hugo` and `webpack` in the appropriate directories if the working
   * directory is a valid Quire project (as determined by `preflight()`).
   * Hugo runs with the `server` subcommand and Webpack runs with the `--watch`
   * flag. `hugo` must be available on the user's system, but Webpack does not
   * need to be globally installed as long as the WEBPACK_BIN is available in
   * the theme's local dependencies.
   */
  preview () {
    this.notice('Launching preview server.')
    let theme = this.preflight()
    this.webpack = this.webpackWatch(theme.path)
    this.hugo = this.hugoServer()
    this.confirm('Navigate to localhost:1313 to see your changes')
    this.notice('Press CTRL+C to stop the server.')
  }

  /**
   * Build
   *
   * @description Runs `webpack` and `hugo` synchronously, one after the other. `hugo` must
   * be available on the user's system, but Webpack does not need to be *
   * globally installed as long as the WEBPACK_BIN is available in the theme's
   * local dependencies.
   */
  build () {
    let theme = this.preflight()
    let outputDir = readYAML(path.join(process.cwd(), 'config.yml'))
      .publishDir || 'public'
    this.notice('Building site...')
    this.webpackBuild(theme.path)
    this.hugoBuild()
    this.confirm('Project built successfully.')
    this.confirm(`Files output to: ${outputDir}`)
  }

  /**
   * Epub
   *
   * @todo Implement this command
   */
  epub () {
    this.notice('Work in progress.')
  }

  /**
   * PDF
   *
   */
  pdf () {
    if (this.commandMissing('prince')) {
      this.warn('Please install Prince to generate a PDF.')
    }

    let chapters = this.chapterPaths()
    chapters.push('-o', 'static/downloads/output.pdf')
    this.hugo = this.hugoServer()

    execa(path.join('node_modules', '.bin', 'webpack'), [], {cwd: `themes/${CONFIG.THEME_NAME}`})
      .catch((error) => {
        this.error(error.message)
      })
      .then(() => {
        console.log(chapters)
        this.princeBuild(chapters)
        this.hugo.kill()
      })
  }

  /**
   * basepath
   *
   * @private
   * @return {string}
   * @description Returns the local basepath of the project BaseURL as specified
   * in the project's `config.yml`.
   */
  basePath () {
    return (readYAML('config.yml').baseurl || '').split('/').pop()
  }

  chapterPaths () {
    return _.map(this.sortedPDFChapters(), (c) => {
      return this.getPathForChapter(c)
    })
  }

  /**
   * commandMissing
   *
   * @private
   * @param {string} Command
   * @return {bool}
   */
  commandMissing (command) {
    return !exists(command)
  }

  /**
   * confirm
   *
   * @private
   * @param {string} msg
   */
  confirm (msg) {
    console.log(chalk.green(msg))
  }

  /**
   * error
   *
   * @private
   * @param {string} msg
   */
  error (msg) {
    console.log(chalk.red(msg))
    process.exitCode = 1
  }

  getPathForChapter (chapter) {
    let basePath = this.basePath()
    let p = path.parse(path.relative('content', chapter))

    if (p.name === '_index' || p.name === 'index') {
      return new URL(
        path.join(basePath, p.dir),
        CONFIG.LOCALHOST
      ).href.toLowerCase()
    } else {
      return new URL(
        path.join(basePath, p.dir, p.name),
        CONFIG.LOCALHOST
      ).href.toLowerCase()
    }
  }

  hugoBuild (cwd) {
    cwd = cwd || process.cwd()
    spawnSync('hugo', {
      // cwd: cwd, stdio: 'inherit'
      cwd: cwd
    })
  }

  hugoServer (cwd) {
    cwd = cwd || process.cwd()
    return spawn('hugo', ['server'], {
      cwd: cwd,
      stdio: 'inherit'
      // cwd: cwd
    })
  }

  isValidProject () {
    if (fs.existsSync(path.join(this.currentDir, 'config.yml'))) {
      return true
    } else {
      return false
    }
  }

  /**
   * Notice
   *
   * @private
   * @param {string} msg
   */
  notice (msg) {
    console.log(msg)
  }

  npmInstall (cwd) {
    cwd = cwd || process.cwd()
    spawnSync('npm', ['install'], {
      // cwd: cwd, stdio: 'inherit'
      cwd: cwd
    }, function (err) {
      if (err) this.emit('error', err)
    })
  }

  preflight () {
    if (this.isValidProject()) {
      let config = readYAML(path.join(this.currentDir, 'config.yml'))
      return {
        name: config.theme,
        path: path.join(this.currentDir, 'themes', config.theme)
      }
    } else {
      this.emit('error', new Error(
        'No valid project exists at this location.'))
    }
  }

  princeBuild (args) {
    this.notice('Running Prince...')
    spawnSync('prince', args, {
      cwd: this.currentDir,
      stdio: 'inherit'
    })
  }

  shutdown () {
    this.notice('Shutting down Quire')
    if (this.hasOwnProperty('hugo')) {
      this.hugo.kill()
    }
    if (this.hasOwnProperty('webpack')) {
      this.webpack.kill()
    }
  }

  /**
   * sortedPDFChapters
   *
   * @private
   * @return {Array<String>}
   */
  sortedPDFChapters () {
    let contentFiles = glob.sync('content/**/*.md')
    return _
      .sortBy(contentFiles, function (f) {
        return frontmatter.loadFront(f).weight
      })
      .filter(function (f) {
        return frontmatter.loadFront(f).pdf !== false
      })
  }

  /**
   * Warn
   *
   * @private
   * @param {string} msg
   */
  warn (msg) {
    console.log(chalk.yellow(msg))
    process.exitCode = 1
  }

  webpackBuild (cwd) {
    cwd = cwd || process.cwd()
    spawnSync(path.join('node_modules', '.bin', 'webpack'), {
      // cwd: cwd, stdio: 'inherit'
      cwd: cwd
    })
  }

  webpackWatch (cwd) {
    cwd = cwd || process.cwd()
    return spawn(path.join('node_modules', '.bin', 'webpack'), ['--watch'], {
      cwd: cwd,
      stdio: 'inherit'
      // cwd: cwd
    })
  }
}

module.exports = CLI
