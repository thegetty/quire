const EventEmitter = require('events')
const _ = require('lodash')
const axios = require('axios')
const path = require('path')
const { URL } = require('url')
const striptags = require('striptags')
const Chapter = require('./chapter')
const { determineBaseURL } = require('./utils')

/**
 * Epub Class.
 * @param {Object} bookData
 * @param {Object} configData
 * @description Generates data in the format expected by Pe-Epub and writes it
 * to a JSON file.
 */
class Epub extends EventEmitter {
  constructor (bookData, configData) {
    super()
    this.data = bookData
    this.config = configData

    this.outputDir = this.config.outputDir || 'site'
    this.imageDir = this.config.imageDir || 'img'
  }

  title () {
    if (this.data.subtitle && this.data.reading_line) {
      return `${this.data.title}: ${this.data.subtitle} ${this.data.reading_line}`
    } else if (this.data.subtitle) {
      return `${this.data.title}: ${this.data.subtitle}`
    }
  }

  creators () {
    if (!this.data.contributor) { return false }

    let creators = _.castArray(this.data.contributor).filter(contributor => contributor.type === "primary")

    return creators.map((contributor) => {
      let name = contributor.full_name || `${contributor.first_name} ${contributor.last_name}`
      return {
        name: name,
        'file-as': `${contributor.last_name}, ${contributor.first_name}`,
        role: `${contributor.role || 'aut'}`
      }
    })
  }

  contributors () {
    if (!this.data.contributor) { return false }

    let contributors = _.castArray(this.data.contributor).filter(contributor => contributor.type === "secondary-contributor")
    return contributors.map((contributor) => {
      let name = contributor.full_name || `${contributor.first_name} ${contributor.last_name}`
      return {
        name: name,
        'file-as': `${contributor.last_name}, ${contributor.first_name}`,
        role: `${contributor.role || 'aut'}`
      }
    })
  }

  publishers () {
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

  loadChapterURLs () {
    let promiseArray = this.data.chapters.map(url => axios.get(url))
    return axios.all(promiseArray)
  }

  cover () {
    if (this.data.promo_image) {
      let coverUrl = this.getURLforImage(this.data.promo_image)
      return `${coverUrl}`
    } else {
      return 'http://s3.amazonaws.com/net.thepeoplesebook/pe-epub/printing-press.jpg'
    }
  }

  generate () {
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
      description: striptags(this.data.description.full).replace(/\r?\n|\r/g, ""),
      rights: this.data.copyright
    }

    // load the contents and inject them into the pub data object
    return this.loadChapterURLs()
      .then(results => results.map(r => {
        return new Chapter(r.data, {
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
  getURLforImage (image) {
    let imageDir = (this.config.imageDir || 'img')
    // let relPath = path.parse(path.relative(imageDir, image))
    let baseURL = determineBaseURL(this.config.baseURL)
    let localhost = 'http://localhost:1313'

    return new URL(path.join(baseURL, imageDir, image), localhost).href.toLowerCase()
  }
}

module.exports = Epub
