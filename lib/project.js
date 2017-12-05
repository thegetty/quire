/**
 * @fileOverview Project Class
 * @author Eric Gardner / Getty Publications
 * @license MIT
 *
 */
const EventEmitter = require('events')
const _ = require('lodash')
const axios = require('axios')
const cheerio = require('cheerio')
const execa = require('execa')
const frontmatter = require('yaml-front-matter')
const glob = require('glob')
const path = require('path')
const spawn = require('child_process').spawn
const spawnSync = require('child_process').spawnSync
const { URL } = require('url')
const { commandMissing, readYAML } = require('./utils')

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
  constructor () {
    super()
    this.config = this.loadConfig()
    this.theme = this.config.theme
    this.chapters = this.chapters()
  }

  /**
   * loadConfig
   * @returns {Object} YAML data
   * @description Attempts to read a `config.yml` file in the current directory
   * inside a try/catch block. If successful, returns a JS object with
   * properties corresponding to the YAML fields.
   */
  loadConfig () {
    try {
      return readYAML('config.yml')
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
   * preview
   * @description Checks to ensure the 'hugo' command is available, then runs
   * `webpack --watch` and `hugo server` as child processes.
   */
  preview () {
    this.checkForCommand('hugo')
    let webpackBin = path.join('node_modules', '.bin', 'webpack')
    this.emit('info', 'Launching preview server')

    spawn(webpackBin, ['--watch'], { cwd: path.join('themes', this.theme), stdio: 'inherit' })
    spawn('hugo', ['server'])
    this.emit('info', 'Navigate to http://localhost:1313 to see your changes.')
    this.emit('info', 'Press CTRL+C to stop the server.')
  }

  /**
   * buildTheme
   * @returns {Promise} Webpack child process
   * @description Returns a `child_process` instance enhanced to also be a `Promise`
   * for a result `Object` with `stdout` and `stderr` properties. This process runs
   * `webpack` in the project theme folder.
   */
  buildTheme () {
    let webpackBin = path.join('node_modules', '.bin', 'webpack')
    return execa(webpackBin, {
      cwd: path.join('themes', this.theme),
      stdio: 'inherit'
    })
  }

  /**
   * buildWeb
   * @description Checks to ensure the `hugo` command is available, then builds
   * the theme (using the buildTheme() method above) and runs `hugo` in the
   * current project folder.
   */
  buildWeb () {
    this.checkForCommand('hugo')

    let outputDir = this.config.publishDir || 'public'
    this.emit('info', 'Building theme assets... \n')
    this.buildTheme()
      .then(() => {
        spawnSync('hugo', { stdio: 'inherit' })
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
    let baseURL = this.determineBaseURL()
    let localhost = 'http://localhost:1313'

    if (relPath.name === '_index' || relPath.name === 'index') {
      return new URL(path.join(baseURL, relPath.dir), localhost).href.toLowerCase()
    } else {
      return new URL(path.join(baseURL, relPath.dir, relPath.name), localhost).href.toLowerCase()
    }
  }

  /**
   * buildPDF
   * @description Checks to ensure both `hugo` and `prince` commands are
   * available. If so, builds the PDF version of the book by filtering out a
   * subset of all chapters which do not have a `pdf` flag set to false in
   * frontmatter. The order of operations is: 1) run `hugo server` 2) build
   * the theme with webpack, 3) hit each of the PDF chapters with `prince`
   */
  buildPDF () {
    this.checkForCommand('hugo')
    this.checkForCommand('prince')

    let hugo = spawn('hugo', ['server'])
    let princeArgs = _
        .filter(this.chapters, c => { return frontmatter.loadFront(c).pdf !== false })
        .map(c => { return this.getURLforChapter(c) })
    princeArgs.push('-o', path.join('static', 'downloads', 'output.pdf'))

    this.buildTheme()
      .then(() => {
        spawnSync('prince', princeArgs, { stdio: 'inherit' })
        hugo.kill()
        this.emit('info', 'PDF output to: static/downloads/output.pdf')
      })
      .catch(e => {
        this.emit('error', e.message)
        console.log(e)
      })
  }

  /**
   * buildEpub
   * TODO
   * @description Generates a list of epub chapters by filtering out any pages
   * with `epub` set to false in frontmatter, then spins up hugo & webpack and
   * makes a series of web requests using Axios. The result of each request is
   * passed to getPageContent() for parsing by Cheerio when the requests
   * resolve.
   */
  buildEpub () {
    this.checkForCommand('hugo')

    let hugo = spawn('hugo', ['server'])
    let epubChapters = _
        .filter(this.chapters, c => { return frontmatter.loadFront(c).epub !== false })
        .map(c => this.getURLforChapter(c))

    this.buildTheme()
      .then(() => { return epubChapters.map(url => axios.get(url)) })
      .then(promiseArray => { return axios.all(promiseArray) })
      .then(results => {
        results.map(r => { console.log(this.getPageContent(r.data)) })
        hugo.kill()
      })
      .catch(e => {
        this.emit('error', e.message)
        console.log(e)
      })
  }

  /**
   * getPageContent
   * TODO
   * @param {String} page
   * @returns {String}
   * @description Parse the string HTML data of a page and return the core
   * content for loading into an Epub template.
   */
  getPageContent (page) {
    let $ = cheerio.load(page, { xml: { normalizeWhitespace: true } })
    return $('h1').text()
  }

  // TODO: move to utils?
  checkForCommand (cmd) {
    if (commandMissing(cmd)) { this.emit('error', `Please install ${cmd} before continuing.`) }
  }

  // TODO
  determineBaseURL () {
    try {
      return new URL(this.config.baseURL).pathname
    } catch (e) {
      if (e instanceof TypeError) {
        return path.parse(this.config.baseURL || '').name
      }
    }
  }
}

module.exports = Project
