/**
 * @fileOverview Quire class
 * @author Eric Gardner / Getty Publications
 * @license MIT
 *
 */

const EventEmitter = require('events')
const chalk = require('chalk')
const exists = require('command-exists').sync
const fs = require('fs')
const path = require('path')
const spawn = require('child_process').spawn
const spawnSync = require('child_process').spawnSync
const URL = require('url').URL
const yaml = require('js-yaml')
const WEBPACK_BIN = './node_modules/.bin/webpack'

const CONFIG = {
  STARTER_REPO: 'https://github.com/gettypubs/quire-starter.git',
  THEME_REPO_BASEURL: 'https://github.com/gettypubs/quire-catalogue-theme',
  DEFAULT_PROJECT_NAME: 'quire-project'
}

class QuireCLI extends EventEmitter {
  constructor() {
    super()
    this.currentDir = process.cwd()

    this.on('new', this.create)
    this.on('preview', this.preview)
    this.on('build', this.build)
    this.on('epub', this.preview)
    this.on('pdf', this.preview)
    this.on('error', this.warn)
  }

  // Commands //////////////////////////////////////////////////////////////////
  create(projectName) {
    if (this._commandMissing('git')) {
      this.emit('warning', 'Please install Git before continuing.')
    }

    this.notice('Installing starter kit...')
    this._cloneStarterRepo(projectName)
    this.confirm('Starter kit successfully installed.')

    process.chdir(projectName)
    this.notice('Installing theme and theme dependencies...')
    this._cloneThemeRepo()
    this._installThemeDependencies()
    this.confirm('Theme and dependencies successfully installed.')

    process.chdir(this.currentDir)
    this.notice('Run quire preview in your project folder to view changes locally.')
  }

  preview() {
    this._preflight()
    this.webpack = spawn(WEBPACK_BIN, ['--watch'], { cwd: this.themePath, stdio: 'inherit' })
    this.hugo = spawn('hugo', ['server'], { stdio: 'inherit' })
  }

  build() { /* TODO */ }
  epub() { /* TODO */ }
  pdf() { /* TODO */ }

  // Utility Methods ///////////////////////////////////////////////////////////
  confirm(msg) { console.log(chalk.green(msg)) }

  notice(msg) { console.log(msg) }

  warn(msg) {
    console.log(chalk.yellow(msg))
    process.exitCode = 1
  }

  _commandMissing(command) { return !exists(command) }

  _cloneStarterRepo(projectName) {
    spawnSync('git', ['clone', CONFIG.STARTER_REPO, projectName], {
      stdio: 'inherit'
    }, function(err) { if (err) this.emit('error', err) })
  }

  _cloneThemeRepo() {
    this.themeName = yaml.safeLoad(fs.readFileSync(path.join(process.cwd(), 'config.yml'), 'utf8')).theme
    this.themePath = path.join(process.cwd(), 'themes', this.themeName)
    let themeURL = new URL(this.themeName, CONFIG.THEME_REPO_BASEURL)
    spawnSync('git', ['clone', themeURL, this.themePath], {
      stdio: 'inherit'
    }, function(err) { if (err) this.emit('error', err) })
  }

  _installThemeDependencies() {
    if (this._commandMissing('npm')) {
      this.emit('warning', 'Please install Node JS and NPM before continuing')
    }
    spawnSync('npm', ['install'], {
      cwd: this.themePath, stdio: 'inherit'
    }, function(err) { if (err) this.emit('error', err) })
  }

  _isValidProject() {
    if (fs.existsSync(path.join(this.currentDir, 'config.yml'))) {
      return true
    } else {
      return false
    }
  }

  _isWebpackTheme() {
    if (fs.existsSync(path.join(this.themePath, 'webpack.config.js'))) {
      return true
    } else {
      return false
    }
  }

  _preflight() {
    if (!this._isValidProject()) {
      this.emit('error', new Error('No valid project exists at this location.'))
    }
    if (this._commandMissing('hugo')) {
      this.emit('warning', 'Please install Hugo before continuing.')
    }
    this.themeName = yaml.safeLoad(fs.readFileSync(path.join(process.cwd(), 'config.yml'), 'utf8')).theme
    this.themePath = path.join(process.cwd(), 'themes', this.themeName)
  }

  _themePath() {
    let themeName = yaml.safeLoad(
      fs.readFileSync(path.join(process.cwd(), 'config.yml'), 'utf8')
    ).theme

    return path.join(process.cwd(), 'themes', themeName)
  }
}

module.exports = QuireCLI
