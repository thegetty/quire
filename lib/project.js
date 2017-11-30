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
const parseURL = require('url').parse
const path = require('path')
const spawn = require('child_process').spawn
const spawnSync = require('child_process').spawnSync
const { URL } = require('url')
const { commandMissing, readYAML } = require('./utils')

class Project extends EventEmitter {
  constructor () {
    super()
    this.config = this.loadConfig()
    this.theme = this.config.theme
    this.chapters = this.chapters()
  }

  loadConfig () {
    try {
      return readYAML('config.yml')
    } catch (e) {
      this.emit('error', e)
    }
  }

  chapters () {
    let contentFiles = glob.sync(path.join(this.config.contentDir || 'content', '**', '*.md'))

    return _.sortBy(contentFiles, f => {
      return frontmatter.loadFront(f).weight
    })
  }

  preview () {
    if (commandMissing('hugo')) {
      this.emit('error', 'Please install Hugo before continuing.')
    }

    let webpackBin = path.join('node_modules', '.bin', 'webpack')
    this.emit('info', 'Launching preview server')

    spawn(webpackBin, ['--watch'], { cwd: path.join('themes', this.theme), stdio: 'inherit' })
    spawn('hugo', ['server'])

    this.emit('info', 'Navigate to http://localhost:1313 to see your changes.')
    this.emit('info', 'Press CTRL+C to stop the server.')
  }

  buildTheme () {
    let webpackBin = path.join('node_modules', '.bin', 'webpack')
    return execa(webpackBin, {
      cwd: path.join('themes', this.theme),
      stdio: 'inherit'
    })
  }

  buildWeb () {
    if (commandMissing('hugo')) {
      this.emit('error', 'Please install Hugo before continuing.')
    }

    let outputDir = this.config.publishDir || 'public'
    this.emit('info', 'Building theme assets... \n')
    this.buildTheme()
      .catch(e => { this.emit('error', e.message) })
      .then(() => {
        spawnSync('hugo', { stdio: 'inherit' })
        this.emit('info', 'Site built successfully')
        this.emit('info', `Files output to: ${outputDir}`)
      })
  }

  getURLforChapter (chapter) {
    let baseURL = parseURL(this.config.baseurl).path || ''
    let contentDir = (this.config.contentDir || 'content')
    let relPath = path.parse(path.relative(contentDir, chapter))

    if (relPath.name === '_index' || relPath.name === 'index') {
      return new URL(
        path.join(baseURL, relPath.dir),
        'http://localhost:1313'
      ).href.toLowerCase()
    } else {
      return new URL(
        path.join(baseURL, relPath.dir, relPath.name),
        'http://localhost:1313'
      ).href.toLowerCase()
    }
  }

  buildPDF () {
    if (commandMissing('prince')) {
      this.emit('error', 'Please install Prince to generate a PDF.')
    }

    if (commandMissing('hugo')) {
      this.emit('error', 'Please install Hugo before continuing.')
    }

    let hugo = spawn('hugo', ['server'])
    let princeArgs = _
        .filter(this.chapters, c => { return frontmatter.loadFront(c).pdf !== false })
        .map(c => { return this.getURLforChapter(c) })

    princeArgs.push('-o', path.join('static', 'downloads', 'output.pdf'))

    this.buildTheme()
      .catch(e => { this.emit('error', e.message) })
      .then(() => {
        spawnSync('prince', princeArgs, { stdio: 'inherit' })
        hugo.kill()
        this.emit('info', 'PDF output to: static/downloads/output.pdf')
      })
  }

  buildEpub () {
    if (commandMissing('hugo')) {
      this.emit('error', 'Please install Hugo before continuing.')
    }

    let hugo = spawn('hugo', ['server'])
    let epubChapters = _
        .filter(this.chapters, c => { return frontmatter.loadFront(c).epub !== false })
        .map(c => this.getURLforChapter(c))

    this.buildTheme()
      .catch(e => { this.emit('error', e.message) })
      .then(() => {
        let promiseArray = epubChapters.map(url => axios.get(url))

        axios.all(promiseArray)
          .catch(e => { this.emit('error', e.message) })
          .then(results => {
            results.map(r => {
              let main = this.getPageContent(r.data)
              console.log(main)
            })
            hugo.kill()
          })
      })
  }

  getPageContent (page) {
    let $ = cheerio.load(page, { xml: { normalizeWhitespace: true } })
    return $('#main h1').text()
  }
}

module.exports = Project
