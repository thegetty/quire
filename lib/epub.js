const EventEmitter = require('events')
const _ = require('lodash')
const axios = require('axios')
const cheerio = require('cheerio')
const path = require('path')

/**
 * Epub Class.
 * @param {Object} bookData
 * @param {Object} configData
 */
class Epub extends EventEmitter {
  constructor (bookData, configData) {
    super()
    this.data = bookData
    this.config = configData

    this.outputDir = this.config.outputDir || 'public'
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

  /**
   * getPageContent
   * TODO get this working for all assets, not just <img> tags
   * @param {String} HTML String
   * @returns {Object} {title: String, body: String}
   * @description Parse the string HTML data of a page and return the core
   * content for loading into an Epub template.
   */
  getPageContent (page) {
    function attrMatches (el, attr, regex) {
      return $(el).attr(attr).match(regex)
    }

    let $ = cheerio.load(page)
    let $pageContent = $('#main') || $('.quire__primary__inner')
    let $pageImgs = $pageContent.find('img')
    let $pageLinks = $pageContent.find('a')
    let canonical = $('link[rel="canonical"]').attr('href')

    let $idStartsWithNumber = $pageContent.find('[id]').filter(function (i, el) { return attrMatches(el, 'id', /^[\d]+/) })
    let $idContainsColon = $pageContent.find('[id*=":"]')

    // Fix invalid EPUB IDs
    $idStartsWithNumber.attr('id', (index, id) => { return '_'.concat(id) })
    $idContainsColon.attr('id', (index, id) => { return id.replace(':', '-') })

    // process images and convert to file:/// URLs for Pe-Epub
    $pageImgs.attr('src', (index, src) => {
      let localPath = path
          .resolve(path.join(this.outputDir, this.imageDir), src)
          .replace(/\/localhost:1313/, path.join(process.cwd(), this.outputDir))
      return 'file://' + localPath
    })

    // strip out relative links and convert cross-reference links
    $pageLinks
      .not((index, el) => { return $(el).attr('href').match(/^#/) })
      .attr('href', (index, el) => { return this.convertToEpubLink(el) })

    // Convert any ":" characters in anchor links to "-"
    $pageLinks
      .filter((index, el) => { return $(el).attr('href').match(/^#/) })
      .attr('href', (index, href) => { return href.replace(':', '-') })

    // prepend any links that start with numbers with "_"
    $pageLinks
      .filter(function (i, el) { return attrMatches(el, 'href', /^#[\d]+/) })
      .attr('href', (index, href) => { return '_'.concat(href) })

    return {
      title: $('h1').text(),
      body: $.xml($pageContent),
      href: this.convertToEpubLink(canonical)
    }
  }

  convertToEpubLink (href) {
    if (href.match(/^(https|http|www)/)) { return href }

    let chapterName = path
        .normalize(href.replace('localhost:1313', ''))
        .replace(/^\//, '')
        .replace(/\/$/, '')
        .replace('/', '__')

    return (chapterName || 'cover').concat('.xhtml')
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
      .then(results => results.map(r => this.getPageContent(r.data)))
      .then(chapterContent => {
        publication.pages = chapterContent
        return publication
      })
      .catch(e => console.log(e))
  }
}

module.exports = Epub
