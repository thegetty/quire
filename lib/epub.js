const EventEmitter = require('events')
const _ = require('lodash')
const axios = require('axios')
const util = require('util')
const fs = require('fs')
const writeFile = util.promisify(fs.writeFile)
const rimraf = require('rimraf')
const rimrafp = util.promisify(rimraf)
const sanitizeHtml = require('sanitize-html')
const path = require('path')
const { URL } = require('url')
const striptags = require('striptags')
const Chapter = require('./chapter')
const { determineBaseURL } = require('./utils')
const pandocTemplate = require('./templates/epubTemplate')
const LOCALHOST = 'http://localhost:1313'
/**
 * Epub Class.
 * @param {Object} bookData
 * @param {Object} configData
 * @description Generates data in the format expected by Pe-Epub and writes it
 * to a JSON file.
 */
class Epub extends EventEmitter {
  constructor(bookData, configData) {
    super()
    this.data = bookData
    this.config = configData

    this.outputDir = this.config.outputDir || 'site'
    this.imageDir = this.config.imageDir || 'img'
  }

  title() {
    if (this.data.subtitle && this.data.reading_line) {
      return `${this.data.title}: ${this.data.subtitle} ${this.data.reading_line}`
    } else if (this.data.subtitle) {
      return `${this.data.title}: ${this.data.subtitle}`
    }
  }

  creators() {
    if (!this.data.contributor) { return false }

    let creators = _.castArray(this.data.contributor).filter(contributor => contributor.type === "primary")

    return creators.map((contributor) => {
      let name = contributor.full_name || `${contributor.first_name} ${contributor.last_name}`
      let item = {
        name: name,
        role: `${contributor.role || 'aut'}`
      }

      if (contributor.last_name && contributor.first_name) {
        item['file-as'] = `${contributor.last_name}, ${contributor.first_name}`
      }

      return item;
    })
  }

  contributors() {
    if (!this.data.contributor) { return false }

    let contributors = _.castArray(this.data.contributor).filter(contributor => contributor.type === "secondary")
    return contributors.map((contributor) => {
      let name = contributor.full_name || `${contributor.first_name} ${contributor.last_name}`
      let item = {
        name: name,
        role: `${contributor.role || 'aut'}`
      }

      if (contributor.last_name && contributor.first_name) {
        item['file-as'] = `${contributor.last_name}, ${contributor.first_name}`
      }

      return item;
    })
  }

  publishers() {
    if (!this.data.publishers) { return false }

    let publishers = _.castArray(this.data.publishers)
    return publishers.map((p) => {
      if (p.location) {
        return `${p.name}, ${p.location}`
      } else {
        return `${p.name}`
      }
    })
  }

  loadChapterURLs() {
    let promiseArray = this.data.chapters.map(url => axios.get(url))
    return axios.all(promiseArray)
  }

  cover() {
    if (this.data.promo_image) {
      let coverUrl = this.getURLforImage(this.data.promo_image)
      return `${coverUrl}`
    } else {
      return 'https://user-images.githubusercontent.com/7796401/39769476-29929fe4-52a1-11e8-85ac-ff41505b3d4c.png'
    }
  }

  generate() {
    // build the data structure
    let publication = {
      title: this.title(),
      cover: this.cover(),
      url: this.data.url,
      isbn: this.data.isbn,
      languages: this.data.language,
      date: this.data.pub_date,
      creators: this.creators(),
      contributors: this.contributors(),
      publisher: this.publishers(),
      description: striptags(this.data.description.full).replace(/\r?\n|\r/g, " "),
      rights: this.data.copyright,
      css: this.getStylesheetUrl()
    }

    // load the contents and inject them into the pub data object
    return this.loadChapterURLs()
      .then(results => results.map(r => {
        return new Chapter(r.data, publication.title, {
          outputDir: this.outputDir,
          imageDir: this.imageDir
        })
      }))
      .then(chapterContent => {
        publication.pages = chapterContent
        return publication
      })
      .catch(e => console.log(e))
  }

  /**
   * getURLforImage
   * @param {String} image path
   * @returns {String} Localhost URL
   * @description When given the relative path for a image, returns the
   * appropriate URL to view the content when the preview server is running.
   */
  getURLforImage(image) {
    let imageDir = (this.config.imageDir || 'img')
    // let relPath = path.parse(path.relative(imageDir, image))
    let baseURL = determineBaseURL(this.config.baseURL)
    let imagePath = path.join(baseURL, imageDir, image)

    return new URL(imagePath, LOCALHOST).href.toLowerCase()
  }

  /**
   * getStylesheets
   * @returns {Array} Stylesheet Urls
   */
  getStylesheetUrl() {
    let baseURL = determineBaseURL(this.config.baseURL)
    let assetPath = path.join(baseURL, 'css', 'epub.css')

    let stylesheetUrl = new URL(assetPath, LOCALHOST).href.toLowerCase()

    return [stylesheetUrl]
  }
}

module.exports = Epub
