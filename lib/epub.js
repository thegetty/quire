const EventEmitter = require('events')
const _ = require('lodash')
const axios = require('axios')
const Chapter = require('./chapter')

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
    if (!this.data.primary_contributor) { return false }

    let creators = _.castArray(this.data.primary_contributor)
    return creators.map((contributor) => {
      return {
        name: `${contributor.first_name} ${contributor.last_name}`,
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

  generate () {
    // build the data structure
    let publication = {
      title: this.title(),
      cover: 'http://s3.amazonaws.com/net.thepeoplesebook/pe-epub/printing-press.jpg',
      url: this.data.url,
      isbn: this.data.isbn,
      languages: this.data.language,
      date: this.data.pub_date,
      creator: this.creators(),
      publisher: this.publishers(),
      description: this.data.description.full,
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
}

module.exports = Epub
