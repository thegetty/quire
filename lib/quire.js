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

const execa = require('execa')
const spawn = require('child_process').spawn
const spawnSync = require('child_process').spawnSync

const yaml = require('js-yaml')
const frontmatter = require('yaml-front-matter')
const WEBPACK_BIN = './node_modules/.bin/webpack'

const CONFIG = {
  STARTER_REPO: 'https://github.com/gettypubs/quire-starter.git',
  THEME_NAME: 'quire-starter-theme',
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
  //
  create(projectName) {
    // Check for git
    if (this._commandMissing('git')) {
      this.emit('warning', 'Please install Git before continuing.')
    }

    this.notice('Installing starter kit...')
    // Clone the repo and theme submodule
    execa('git', ['clone', '--recursive', CONFIG.STARTER_REPO, projectName]).catch((error) => {
      this.error(error.message)
    }).then((result) => {
      // Configure project repo
      this.notice('Configuring project...')
      process.chdir(projectName)
      spawnSync('git', ['remote', 'rm', 'origin'])
      spawnSync('git', ['rm', '.gitmodules'])
      spawnSync('git', ['rm', '--cached'])
    }).then(() => {
      // Flatten theme submodule
      this.notice('Setting up theme...')
      process.chdir(`themes/${CONFIG.THEME_NAME}`)
      execa('rm', ['-rf', '.git'])
    }).then(() => {
      // Add theme subfolder to project version control
      process.chdir('../..')
      execa('git', ['add', '-A']).then(() => {
        execa('git', ['commit', '-m', 'Add quire-starter-theme to project'])
      })
    }).then(() => {
      // Install theme dependencies
      this.notice('Installing dependencies...')
      this._npmInstall(path.join(process.cwd(), 'themes', CONFIG.THEME_NAME))
      this.confirm('Theme and dependencies successfully installed.')
      this.notice('Run quire preview in your project folder to view changes locally.')
    })
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
    this.preview()
    setTimeout(() => {
      let args = _.map(this._pdfChapters(), (chapter) => { return this._getPathForChapter(chapter) })
      args.push('-o', 'test.pdf')
      console.log(args)
      this._princeBuild(args)
    }, 5000)
  }

  shutdown() {
    this.notice('Shutting down Quire')
    if (this.hasOwnProperty('hugo')) { this.hugo.kill() }
    if (this.hasOwnProperty('webpack')) { this.webpack.kill() }
  }

  // Utility Methods ///////////////////////////////////////////////////////////
  //
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

  error(msg) {
    console.log(chalk.red(msg))
    process.exitCode = 1
  }

  _commandMissing(command) {
    return !exists(command)
  }

  _getPathForChapter(chapter) {
    let baseURL = this._readYAML(path.join(process.cwd(), 'config.yml')).baseurl || ''
    let localPath = baseURL.split('/').pop()
    let previewURL = `http://localhost:1313/${localPath}`

    let p = path.parse(path.relative('content', chapter))
    if (p.name === '_index' || p.name === 'index') {
      // return path.join('public', p.dir, 'index.html')
      return path.join(previewURL, p.dir, '/').toLowerCase()
    } else {
      // return path.join('public', p.dir, p.name, 'index.html')
      return path.join(previewURL, p.dir, p.name, '/').toLowerCase()
    }
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
      cwd: cwd, stdio: 'inherit'
      // cwd: cwd
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
