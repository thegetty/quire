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
  constructor (html, config = {outputDir: 'site', imageDir: 'img'}) {
    this.config = config
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

    if (this.href()) { data.href = this.href() }
    return data
  }

  attrMatches (el, attr, regex) {
    return this.$(el).attr(attr).match(regex)
  }

  epubLink (href) {
    if (href.match(/^(https|http|www)/)) { return href }

    let chapterName = upath
        .normalize(href.replace('localhost:1313', ''))
        .replace(/^\//, '')
        .replace(/\/$/, '')
        .replace('/', '__')
    return (chapterName || 'cover').concat('.xhtml')
  }

  determineTitle () {
    let title
    if (this.content.find('h1')) {
      title = this.content.find('h1').text()
    } else if (this.content.find('h2')) {
      title = this.content.find('h2').text()
    }

    return title || 'Cover'
  }

  body () {
    return this.$.xml(this.content)
  }

  href () {
    let canonical = this.$('link[rel="canonical"]')
    if (canonical) {
      return this.epubLink(canonical.attr('href'))
    } else {
      return null
    }
  }

  reformatPage () {
    let chapter = this

    function reformatNumericalIDs () {
      chapter.content
        .find('[id]')
        .filter((i, el) => { return chapter.attrMatches(el, 'id', /^[\d]+/) })
        .attr('id', (index, id) => { return '_'.concat(id) })
    }

    function reformatIDsWithColons () {
      chapter.content
        .find('[id*=":"]')
        .attr('id', (index, id) => { return id.replace(':', '-') })
    }

    function reformatImgSources () {
      chapter.images
        .attr('src', (index, src) => {
          let localPath = path
              .resolve(path.join(chapter.config.outputDir, chapter.config.imageDir), src)
              .replace(/\/localhost:1313/, path.join(process.cwd(), chapter.config.outputDir))
          return 'file://' + localPath
        })
    }

    function reformatLinks () {
      // Convert cross-refrence links to their proper epub chapter locations
      chapter.links
        .not((index, el) => { return chapter.attrMatches(el, 'href', /^#/) })
        .attr('href', (index, el) => { return chapter.epubLink(el) })

      // Convert any ":" characters in anchor links to "-"
      chapter.links
        .filter((index, el) => { return chapter.attrMatches(el, 'href', /^#/) })
        .attr('href', (index, href) => { return href.replace(':', '-') })

      // prepend any links that start with numbers with "_"
      chapter.links
        .filter(function (i, el) { return chapter.attrMatches(el, 'href', /^#[\d]+/) })
        .attr('href', (index, href) => { return '_'.concat(href) })
    }

    reformatNumericalIDs()
    reformatIDsWithColons()
    reformatImgSources()
    reformatLinks()
  }
}

module.exports = Chapter
