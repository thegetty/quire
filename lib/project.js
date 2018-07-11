/**
 * @fileOverview Project Class
 * @author Eric Gardner / Getty Publications
 * @license MIT
 *
 */
const EventEmitter = require('events')
const Epub = require('./epub')
const _ = require('lodash')
const execa = require('execa')
const frontmatter = require('yaml-front-matter')
const fs = require('fs')
const glob = require('glob')
const hugo = require('hugo-bin')
const path = require('path')
const spawn = require('child_process').spawn
const spawnSync = require('child_process').spawnSync
const execFile = require('child_process').execFile
const execFileSync = require('child_process').execFileSync
const util = require('util')
const writeFile = util.promisify(fs.writeFile)
const { URL } = require('url')
const { commandMissing, readYAML, determineBaseURL, deleteFolderRecursive } = require('./utils')
const chalk = require('chalk')
const EOL = require('os').EOL
const rimraf = require('rimraf')
const rimrafp = util.promisify(rimraf)

const Peepub = require('./pe-epub-fs')(require('./pe-epub'))

/**
 * Project Class.
 *
 * @extends EventEmitter
 * @description The Project class represents an existing Quire project (i.e. a
 * Hugo project with a few extras like a publication.yml file). Like the CLI
 * class it inherits the EventEmitter API in order to send signals based on
 * certain actions taken by the user (commands, kill signal, etc).
 *
 * Usage: a Project instance is created whenever the user runs any commands that
 * work with an existing site (`quire preview` and `quire pdf` for example, but
 * not `quire new`). The constructor does not take any arguments, but the
 * current working directory is used to determine the value various properties.
 * The constructor method attempts to read values from local YAML files.
 */
class Project extends EventEmitter {
  constructor (verbose) {
    super()
    this.config = this.loadConfig()
    if (!this.config.publishDir) { this.config.publishDir = 'site' }
    this.theme = this.config.theme
    this.chapters = this.chapters()
    this.verbose = verbose
  }

  /**
   * loadConfig
   * @returns {Object} YAML data
   * @description Attempts to read a pass yaml file or `config.yml` file in the current directory
   * inside a try/catch block. If successful, returns a JS object with
   * properties corresponding to the YAML fields.
   */
  loadConfig (path) {
    try {
      return readYAML(path || 'config.yml')
    } catch (e) {
      this.emit('error', e)
    }
  }

  /**
   * loadBookData
   * @returns {Object} YAML data
   * @description Attempts to read a `publication.yml` file in the ./data
   * directory inside a try/catch block. If successful, returns a JS object with
   * properties corresponding to the YAML fields.
   */
  loadBookData () {
    try {
      return readYAML(path.join('data', 'publication.yml'))
    } catch (e) {
      this.emit('error', e)
    }
  }

  /**
   * chapters
   * @returns {Array<String>} Array of chapter paths
   * @description Returns an array of strings which represent relative paths to
   * content files in the project, sorted by weight.
   */
  chapters () {
    let contentFiles = glob.sync(path.join(this.config.contentDir || 'content', '**', '*.md'))
    return _.sortBy(contentFiles, f => { return frontmatter.loadFront(f).weight })
  }

  /**
   * check Operating System
   * @returns {boolean} 
   */
  isWin() {
    return process.platform === 'win32' ? true : false
  }

  /**
   * preview
   * @description runs `webpack --watch` and `hugo server` as child processes.
   */
  preview () {
    let stdio = this.verbose ? 'inherit' : ['pipe', 'pipe', process.stderr]
    let cwd = path.join('themes', this.theme)
    let webpackCmd = this.isWin ? 'webpack.cmd' : 'webpack'
    let webpackBin = path.join('node_modules', '.bin', webpackCmd)
    this.emit('info', 'Launching preview server')

    this.webpack = spawn(webpackBin, ['--watch'], { cwd, stdio })

    this.hugo = this.spawnHugo('server', '--config=config.yml,config/environments/dev.yml')

    this.emit('info', 'Navigate to http://localhost:1313 to see your changes.')
    this.emit('info', 'Press Control+C or type "quire stop" to stop the preview.')
  }

  /**
   * install
   * @description runs `npm install` in the theme subfolder
   */
  install() {
    let theme = this.config.theme
    let npmCmd = this.isWin ? 'npm.cmd' : 'npm'
    this.emit('info', 'Installing theme dependencies...')
    spawnSync(npmCmd, ['install'], {
      cwd: path.join('themes', theme), stdio: 'inherit'
    }, function (err) {
      if (err) this.emit('error', err)
    })
    this.emit('info', 'Theme dependencies successfully installed.')
    this.emit('info', 'Run quire preview to view changes locally.')
  }

  /**
   * buildTheme
   * @returns {Promise} Webpack child process
   * @description Returns a `child_process` instance enhanced to also be a `Promise`
   * for a result `Object` with `stdout` and `stderr` properties. This process runs
   * `webpack` in the project theme folder.
   */
  buildTheme() {
    let stdio = this.verbose ? 'inherit' : ['pipe', 'pipe', process.stderr]
    let webpackCmd = this.isWin ? 'webpack.cmd' : 'webpack'
    let webpackBin = path.join('node_modules', '.bin', webpackCmd)
    return execa(webpackBin, {
      cwd: path.join('themes', this.theme),
      stdio: stdio
    })
  }

  /**
   * buildWeb
   * @description builds the theme (using the buildTheme() method above) and
   * runs `hugo` in the current project folder.
   */
  buildWeb (env) {
    let outputDir = this.config.publishDir || 'site'
    let configs = ['config.yml', 'config/site.yml']
    if (env) {
      configs.push(`config/environments/${env}.yml`)
    }

    configs.forEach((c) => {
      let config = this.loadConfig(c);
      this.config = _.merge(this.config, config);
    });

    this.emit('info', 'Building theme assets... \n')
    this.buildTheme()
      .then(() => {
        execFileSync(hugo, ['--config='+configs.join(',')], { stdio: 'inherit' })
        this.emit('info', 'Site built successfully')
        this.emit('info', `Files output to: ${outputDir}`)
      })
      .catch(e => { this.emit('error', e.message) })
  }

  /**
   * getURLforChapter
   * @param {String} chapter path
   * @returns {String} Localhost URL
   * @description When given the relative path for a chapter, returns the
   * appropriate URL to view the content when the preview server is running.
   * index.md files will correctly resolve to their parent directories.
   */
  getURLforChapter (chapter) {
    let contentDir = (this.config.contentDir || 'content')
    let relPath = path.parse(path.relative(contentDir, chapter))
    let baseURL = determineBaseURL(this.config.baseURL)
    let localhost = 'http://localhost:1313'

    if (frontmatter.loadFront(chapter).url) {
      let userDefinedURL = frontmatter.loadFront(chapter).url
      return new URL(path.join(baseURL, userDefinedURL), localhost).href.toLowerCase()
    } else if (frontmatter.loadFront(chapter).slug) {
      let userDefinedURL = frontmatter.loadFront(chapter).slug
      return new URL(path.join(baseURL, relPath.dir, userDefinedURL), localhost).href.toLowerCase()
    } else if (relPath.name === '_index' || relPath.name === 'index') {
      return new URL(path.join(baseURL, relPath.dir), localhost).href.toLowerCase()
    } else {
      return new URL(path.join(baseURL, relPath.dir, relPath.name), localhost).href.toLowerCase()
    }
  }

  /**
   * buildPDF
   * @description Checks to ensure `prince` command is available. If so,
   * builds the PDF version of the book by filtering out a subset of all
   * chapters which do not have a `pdf` flag set to false in frontmatter. The
   * order of operations is: 1) run `hugo server` 2) build the theme with
   * webpack, 3) hit each of the PDF chapters with `prince`
   */
  buildPDF (env) {
    this.checkForCommand('prince')
    let configs = ['config.yml', 'config/epub.yml']
    if (env) {
      configs.push(`config/environments/${env}.yml`)
    }

    configs.forEach((c) => {
      let config = this.loadConfig(c);
      this.config = _.merge(this.config, config);
    });

    let hugoServer = this.spawnHugo('server', '--config='+configs.join(','))
    let princeArgs = _
        .filter(this.chapters, c => { return frontmatter.loadFront(c).pdf !== false })
        .map(c => { return this.getURLforChapter(c) })
    princeArgs.push('-o', path.join('static', 'downloads', 'output.pdf'))

    this.buildTheme()
      .then(() => {
        spawnSync('prince', princeArgs, { stdio: 'inherit' })
        hugoServer.kill()
        this.emit('info', 'PDF output to: static/downloads/output.pdf')
      })
      .catch(e => {
        this.emit('error', e.message)
        console.log(e)
      })
  }

  /**
   * buildEpub
   * @description TODO
   */
  buildEpub (filePath, env) {
    let configs = ['config.yml', 'config/epub.yml']
    if (env) {
      configs.push(`config/environments/${env}.yml`)
    }

    configs.forEach((c) => {
      let config = this.loadConfig(c);
      this.config = _.merge(this.config, config);
    });

    this.hugo = this.spawnHugo('server', '--renderToDisk', '--config='+configs.join(','));
    let peepub;
    this.buildTheme()
      .then(() => {
        return this.hugo.ready
      })
      .then((output, server) => {
        let bookData = this.loadBookData()
        let configData = this.config

        bookData.chapters = _
            .filter(this.chapters, c => { return frontmatter.loadFront(c).epub !== false })
            .map(c => this.getURLforChapter(c))
        let ebook = new Epub(bookData, configData)
        return ebook
      })
      .then((ebook) => ebook.generate())
      .then(data => writeFile('output.json', JSON.stringify(data)))
      .then(() => {
        let epubJSON = require(path.join(process.cwd(), 'output.json'))
        let outputPath = filePath || path.join('static', 'downloads', 'output.epub');
        peepub = new Peepub(epubJSON)
        return peepub.create(outputPath)
      })
      .then((epub) => {
        // peepub.clean(true) // TODO: Update to not remove the output epub
        // Remove output from Peepub
        let path = peepub._epubPath();
        return rimrafp(path)
      })
      .then(() => {
        // Remove output.json
        return rimrafp('./output.json')
      })
      .then(() => this.hugo.kill())
      .catch(e => {
        this.emit('error', e)
      })

  }

  // TODO: move to utils?
  checkForCommand (cmd) {
    if (commandMissing(cmd)) { this.emit('error', `Please install ${cmd} before continuing.`) }
  }

  // TODO
  // determineBaseURL () {
  //   let baseURL = this.config.baseURL;
  //   // baseUrl must have a protocol for URL parsing if it has a port
  //   // otherwise the port is parsed as the pathname.
  //   // If it is missing, we are going to assume http protocol
  //   if (baseURL.indexOf("://") === -1 &&
  //       baseURL.indexOf(":") > -1) {
  //     baseURL = "http://" + this.config.baseURL;
  //   }
  //   try {
  //     return new URL(baseURL).pathname
  //   } catch (e) {
  //     if (e instanceof TypeError) {
  //       return path.parse(baseURL || '').name
  //     }
  //   }
  // }

  spawnHugo () {
    let errors = ''
    let reject, resolve
    let hugoServer = spawn(hugo, [...arguments])

    hugoServer.ready = new Promise((promiseResolve, promiseReject) => {
      resolve = promiseResolve
      reject = promiseReject
    })

    // Output Hugo Info
    hugoServer.stdout.on('data', (buf) => {
      let text = buf.toString()
      let output = chalk.cyan(text)

      if (this.verbose) {
        console.log(output)
      }

      // Server is ready
      if (text.indexOf("Press Ctrl+C to stop") > -1 ) {
        resolve(text, hugoServer)
      }
    });

    // Gather Hugo Errors
    hugoServer.stderr.on('data', (buf) => {
      errors += buf.toString()
    });

    // Output Hugo Errors on exit
    hugoServer.on('exit', (code, signal) => {
      if (errors) {
        this.emit('error', errors)
        reject(errors, hugoServer)
      }
    })

    return hugoServer
  }
}

module.exports = Project
