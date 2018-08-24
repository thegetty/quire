const cheerio = require('cheerio')
const path = require('path')
const upath = require('upath')

/**
 * Epub Chapter Class.
 * @param {String} HTML String
 * @param {Object} Config data
 * @return {Object} Chapter data
 * @description Processes HTML into an Epub-friendly format and returns a data
 * object for use in the Pe-Epub JSON "pages" array.
 */
class Chapter {
  constructor(html, epubTitle, config = { outputDir: 'site', imageDir: 'img' }) {
    this.config = config
    this.epubTitle = this.pandocTitle(epubTitle)
    this.$ = cheerio.load(html)
    this.content = this.$('#main') || this.$('.quire__primary__inner')
    this.title = this.determineTitle()
    this.images = this.content.find('img')
    this.links = this.content.find('a')
    this.reformatPage()

    let data = {
      title: this.title,
      body: this.body(),
      toc: true
    }

    if (this.href()) {
      data.href = this.href()
    }

    return data
  }

  pandocTitle(title) {
    let t = title
      .toLowerCase()
      .trim()
      .replace(/[^a-zA-Z ]/g, "")
      .replace(/\s/g, "-")
    return t
  }

  attrMatches(el, attr, regex) {
    return this.$(el).attr(attr).match(regex)
  }

  epubLink(href) {
    if (href.match(/^(https|http|www)/)) {
      return href
    }

    let chapterName = upath
      .normalize(href.replace('localhost:1313', ''))
      .replace(/^\//, '')
      .replace(/\/$/, '')
      .replace('/', '__')

    chapterName = chapterName !== '' ? `${chapterName}` : this.epubTitle
    return chapterName
  }

  determineTitle() {
    let title
    if (this.content.find('h1')) {
      title = this.content.find('h1').text()
    } else if (this.content.find('h2')) {
      title = this.content.find('h2').text()
    }
    return title || 'Cover'
  }

  body() {
    return this.$.xml(this.content)
  }

  href() {
    let canonical = this.$('link[rel="canonical"]')
    if (canonical) {
      let url = this.epubLink(canonical.attr('href')).replace('#', '').concat('.xhtml')
      return url
    } else {
      return null
    }
  }


  reformatPage() {
    let chapter = this

    function removeSpecialCharacters() {
      chapter.content
        .find('[id]')
        .filter((i, el) => { return chapter.attrMatches(el, 'id', /^[\d]+/) })
        .attr('id', (index, id) => { return id.replace(/[^a-zA-Z ]/g, "") })
    }

    function reformatNumericalIDs() {
      chapter.content
        .find('[id]')
        .filter((i, el) => { return chapter.attrMatches(el, 'id', /^[\d]+/) })
        .attr('id', (index, id) => { return '_'.concat(id) })
    }

    function reformatIDsForPandoc() {
      chapter.content
        .find('[id]')
        .attr('id', (index, id) => { return id.replace(/\s/g, "-") })
        .attr('id', (index, id) => { return id.toLowerCase() })
        .attr('id', (index, id) => { return id.replace(':', '-') })
    }

    function reformatIDsWithColons() {
      chapter.content
        .find('[id*=":"]')
        .attr('id', (index, id) => { return id.replace(':', '-') })
    }

    function reformatImgSources() {
      chapter.images
        .attr('src', (index, src) => {
          let localPath = path
            .resolve(path.join(chapter.config.outputDir, chapter.config.imageDir), src)
            .replace(/\/localhost:1313/, chapter.config.outputDir)
          return './' + localPath
        })
    }

    function reformatLinks() {

      // Convert cross-refrence links to their proper epub chapter locations
      chapter.links
        .not((index, el) => { return chapter.attrMatches(el, 'href', /^#/) })
        .attr('href', (index, el) => { return chapter.epubLink(el) })

      // Convert any ":" characters in anchor links to "-"
      chapter.links
        .filter((index, el) => { return chapter.attrMatches(el, 'href', /^#/) })
        .attr('href', (index, href) => { return href.replace(':', '-') })

      // Convert any "cover" links to what pandoc see it as "epub offical title"
      chapter.links
        .filter((index, el) => { return chapter.attrMatches(el, 'href', /^#/) })
        .attr('href', (index, href) => { return href.replace('#cover', `#${chapter.epubTitle}`) })
        .attr('href', (index, href) => { return decodeURIComponent(href) })
        .attr('href', (index, href) => { return decodeURI(href) })
        .attr('href', (index, href) => { return href.toLowerCase() })
        .attr('href', (index, href) => { 
          return href.replace(/\s/g, "-") 
        })

      // Convert anchors to lowercase
      // Decode any urls
      // Convert any " " characters in anchor links to "-"
      chapter.links
        .filter((index, el) => { return chapter.attrMatches(el, 'href', /^#/) })
        .attr('href', (index, href) => { return decodeURIComponent(href) })
        .attr('href', (index, href) => { return decodeURI(href) })
        .attr('href', (index, href) => { return href.toLowerCase() })
        .attr('href', (index, href) => { return href.replace(/\s/g, "-") })
      // prepend any links that start with numbers with "_"
      /*
      chapter.links
        .filter(function (i, el) { return chapter.attrMatches(el, 'href', /^#[\d]+/) })
        .attr('href', (index, href) => { return '_'.concat(href) })
      */
    }

    // removeSpecialCharacters()
    // reformatNumericalIDs()
    reformatIDsWithColons()
    reformatImgSources()
    reformatLinks()
    reformatIDsForPandoc()

  }
}

module.exports = Chapter
