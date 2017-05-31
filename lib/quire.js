/**
 * @fileOverview Quire class
 * @author Eric Gardner / Getty Publications
 * @license MIT
 *
 */

const EventEmitter = require('events')
const _ = require('lodash')
const chalk = require('chalk')
const exists = require('command-exists').sync
const fs = require('fs')
const glob = require('glob')
const path = require('path')
const spawn = require('child_process').spawn
const spawnSync = require('child_process').spawnSync
const URL = require('url').URL
const yaml = require('js-yaml')
const frontmatter = require('yaml-front-matter')
const WEBPACK_BIN = './node_modules/.bin/webpack'

const CONFIG = {
  STARTER_REPO: 'https://github.com/gettypubs/quire-starter.git',
  THEME_REPO_BASEURL: 'https://github.com/gettypubs/quire-web-theme',
  DEFAULT_PROJECT_NAME: 'quire-project'
}

class QuireCLI extends EventEmitter {
  constructor() {
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

  // Commands //////////////////////////////////////////////////////////////////
  create(projectName) {
    // Check for git
    if (this._commandMissing('git')) {
      this.emit('warning', 'Please install Git before continuing.')
    }

    this.notice('Installing starter kit...')
    this._gitClone(CONFIG.STARTER_REPO, projectName)
    this.confirm('Starter kit successfully installed.')

    process.chdir(projectName)
    let theme = this._readYAML(path.join(process.cwd(), 'config.yml')).theme
    let themeURL = new URL(theme, CONFIG.THEME_REPO_BASEURL)
    this.notice('Installing theme and theme dependencies...')
    this._gitClone(themeURL, path.join(process.cwd(), 'themes', theme))
    this._npmInstall(path.join(process.cwd(), 'themes', theme))

    this.confirm('Theme and dependencies successfully installed.')
    this.notice('Run quire preview in your project folder to view changes locally.')
  }

  preview() {
    this.notice('Launching preview server.')
    let theme = this._preflight()
    this.webpack = this._webpackWatch(theme.path)
    this.hugo = this._hugoServer()
    this.confirm('Navigate to localhost:1313 to see your changes')
    this.notice('Press CTRL+C to stop the server.')
  }

  build() {
    let theme = this._preflight()
    let outputDir = this._readYAML(path.join(process.cwd(), 'config.yml')).publishDir || 'public'
    this.notice('Building site...')
    this._webpackBuild(theme.path)
    this._hugoBuild()
    this.confirm('Project built successfully.')
    this.confirm(`Files output to: ${outputDir}`)
  }

  epub() {
    this.notice('The `epub` command still needs to be implemented.')
  }

  pdf() {
    if (this._commandMissing('prince')) {
      this.warn('Please install Prince to generate a PDF.')
    }
    this._preflight()
    this.build()

    // Build PDF theme here?
    spawnSync('hugo', ['--theme', 'quire-pdf'], {cwd: this.currentDir})

    // This approach iterates through all the chapters to produce a list
    // and is supported by the _pdfChapters() method below.
    //
    let fileList = _.map(this._pdfChapters(), (chapter) => {
      return this._getPathForChapter(chapter)
    }).filter(function(filePath) {
      return fs.existsSync(filePath) === true
    })
    //
    let args = fileList

    // This approach relies on the presence of a print-version.md file in the
    // content folder, which has a special "print" template that gathers content
    // on a single page (Prince handles pagination better this way).
    //
    // let args = []
    args.push(
      // this._getPathForChapter('content/_index.md'),
      // this._getPathForChapter('content/print-version.md'),
      '-o',
      'test.pdf'
    )
    console.log(args)
    this._princeBuild(args)
  }

  shutdown() {
    this.notice('Shutting down Quire')
    if (this.hasOwnProperty('hugo')) { this.hugo.kill() }
    if (this.hasOwnProperty('webpack')) { this.webpack.kill() }
  }

  // Utility Methods ///////////////////////////////////////////////////////////
  confirm(msg) {
    console.log(chalk.green(msg))
  }

  notice(msg) {
    console.log(msg)
  }

  warn(msg) {
    console.log(chalk.yellow(msg))
    process.exitCode = 1
  }

  _commandMissing(command) {
    return !exists(command)
  }

  _getPathForChapter(chapter) {
    // let p = path.parse(chapter)
    let p = path.parse(path.relative('content', chapter))
    if (p.name === '_index' || p.name === 'index') {
      return path.join('public', p.dir, 'index.html')
    } else {
      return path.join('public', p.dir, p.name, 'index.html')
    }
  }

  _gitClone(repo, destination) {
    spawnSync('git', ['clone', repo, destination], {
      // stdio: 'inherit'
    }, function(err) { if (err) this.emit('error', err) })
  }

  _hugoBuild(cwd) {
    cwd = cwd || process.cwd()
    spawnSync('hugo', {
      // cwd: cwd, stdio: 'inherit'
      cwd: cwd
    })
  }

  _hugoServer(cwd) {
    cwd = cwd || process.cwd()
    return spawn('hugo', ['server'], {
      // cwd: cwd, stdio: 'inherit'
      cwd: cwd
    })
  }

  _isValidProject() {
    if (fs.existsSync(path.join(this.currentDir, 'config.yml'))) {
      return true
    } else {
      return false
    }
  }

  _npmInstall(cwd) {
    cwd = cwd || process.cwd()
    spawnSync('npm', ['install'], {
      // cwd: cwd, stdio: 'inherit'
      cwd: cwd
    }, function(err) { if (err) this.emit('error', err) })
  }

  _princeBuild(args) {
    this.notice('Running Prince...')
    spawnSync('prince', args, {
      cwd: this.currentDir, stdio: 'inherit'
    })
  }

  _pdfChapters() {
    let contentFiles = glob.sync('content/**/*.md')
    return _.sortBy(contentFiles, function(f) {
      return frontmatter.loadFront(f).weight
    }).filter(function(f) {
      return frontmatter.loadFront(f).pdf !== false
    })
  }

  _preflight() {
    if (this._isValidProject()) {
      let config = this._readYAML(path.join(this.currentDir, 'config.yml'))
      return {
        name: config.theme,
        path: path.join(this.currentDir, 'themes', config.theme)
      }
    } else {
      this.emit('error', new Error('No valid project exists at this location.'))
    }
  }

  _readYAML(file) {
    return yaml.safeLoad(fs.readFileSync(file, 'utf8'))
  }

  _webpackBuild(cwd) {
    cwd = cwd || process.cwd()
    spawnSync(WEBPACK_BIN, {
      // cwd: cwd, stdio: 'inherit'
      cwd: cwd
    })
  }

  _webpackWatch(cwd) {
    cwd = cwd || process.cwd()
    return spawn(WEBPACK_BIN, ['--watch'], {
      cwd: cwd, stdio: 'inherit'
      // cwd: cwd
    })
  }
}

module.exports = QuireCLI
