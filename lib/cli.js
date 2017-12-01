/**
 * @fileOverview CLI class
 * @author Eric Gardner / Getty Publications
 * @license MIT
 *
 */
const EventEmitter = require('events')
const chalk = require('chalk')
const execa = require('execa')
const path = require('path')
const rimraf = require('rimraf')
const spawnSync = require('child_process').spawnSync
const { commandMissing } = require('./utils')

const Project = require('./project')

/**
 * Config object.
 * @description Stashing some fixed values as globals here for now.
 */
const CONFIG = {
  STARTER_REPO: 'https://github.com/gettypubs/quire-starter.git',
  CURRENT_VERSION: 'v0.1.0.alpha.1',
  STARTER_THEME: 'quire-starter-theme',
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
    // this.currentDir = process.cwd()
    this.on('new', this.create)
    this.on('preview', this.preview)
    this.on('build', this.build)
    this.on('epub', this.epub)
    this.on('pdf', this.pdf)
    this.on('error', this.warn)
    this.once('shutdown', this.shutdown)

    // TODO: handle errors emitted by the Project object here somewhere.
    // project.on('error', this.warn)
    // project.on('info', this.notice)
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
    if (commandMissing('git')) { this.emit('warning', 'Please install Git before continuing.') }
    this.notice('Installing starter kit...')

    let projectDir = path.resolve(projectName)
    let themeDir = path.resolve(projectName, 'themes', CONFIG.STARTER_THEME)
    let gitArgs = [
      'clone',
      '--recursive',
      '--branch',
      CONFIG.CURRENT_VERSION,
      CONFIG.STARTER_REPO,
      projectName
    ]

    // Clone the starter kit and submodules at the target version
    execa('git', gitArgs)
      .catch(error => { this.error(error.message) })
      .then(result => {
        this.notice('Configuring project...')
        process.chdir(projectDir)
        spawnSync('git', ['checkout', '-b', 'master'])
        spawnSync('git', ['remote', 'rm', 'origin'])
        spawnSync('git', ['rm', '.gitmodules'])
        spawnSync('git', ['rm', '--cached', path.join('themes', CONFIG.STARTER_THEME)])

        this.notice('Setting up theme...')
        process.chdir(themeDir)
        rimraf.sync('.git')

        process.chdir(projectDir)
        spawnSync('git', ['add', '-A'])
        spawnSync('git', ['commit', '-m', 'Add quire-starter-theme to project'])

        this.notice('Installing dependencies...')
        this.npmInstall(themeDir)
        this.confirm('Theme and dependencies successfully installed.')
        this.notice('Run quire preview in your project folder to view changes locally.')
      })
  }

  preview () {
    let project = new Project()
    project.on('info', this.notice)
    project.on('error', this.error)
    project.preview()
  }

  build () {
    let project = new Project()
    project.on('info', this.notice)
    project.on('error', this.error)
    project.buildWeb()
  }

  epub () {
    let project = new Project()
    project.on('info', this.notice)
    project.on('error', this.error)
    project.buildEpub()
  }

  pdf () {
    let project = new Project()
    project.on('info', this.notice)
    project.on('error', this.error)
    project.buildPDF()
  }

  confirm (msg) {
    console.log(chalk.green(msg))
  }

  error (msg) {
    console.log(chalk.red(msg))
    process.exitCode = 1
  }

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

  shutdown () {
    this.notice('Shutting down Quire')
    if (this.hasOwnProperty('hugo')) {
      this.hugo.kill()
    }
    if (this.hasOwnProperty('webpack')) {
      this.webpack.kill()
    }
  }

  warn (msg) {
    console.log(chalk.yellow(msg))
    process.exitCode = 1
  }
}

module.exports = CLI
