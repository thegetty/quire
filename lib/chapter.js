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
      // lowercase
      .toLowerCase()
      // replace multiple spaces with a single space
      .replace(/\s\s+/g, ' ')
      // trim string
      .trim()
      // remove special characters
      .replace(/[^a-zA-Z0-9 ]/g, '')
      // replace single space with -
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

    function reformatNumericalIDs() {
      chapter.content
        .find('[id]')
        .filter((i, el) => { return chapter.attrMatches(el, 'id', /^[\d]+/) })
        .attr('id', (index, id) => {
          return `${id}-${chapter.pandocTitle(chapter.title)}`
        })
    }

    function reformatIDsForPandoc() {
      chapter.content
        .find('[id]')
        // Decode
        .attr('id', (index, id) => {
          return id.toLowerCase()
        })
        // Decode
        .attr('id', (index, id) => {
          return id.replace(/[^a-zA-Z0-9 ]/g, " ")
        })
        // replace multiple spaces with a single space
        .attr('id', (index, id) => {
          return id.replace(/\s\s+/g, ' ')
        })
        // Convert any " " characters in anchor links to "-"
        .attr('id', (index, id) => {
          return id.replace(/\s/g, "-")
        })
        // Deal with footnoten and footnote return ids
        .attr('id', (index, id) => {
          if (id.indexOf('fn-') !== -1 || id.indexOf('fnref-') !== -1) {
            return `${id}-${chapter.pandocTitle(chapter.title)}`
          }
          return `${id}`
        })
    }

    // Find duplicate ids and increment
    function findDupIds() {
      let idCounts = {}
      chapter.content
        .find('[id]')
        .attr('id', (index, id) => {
          idCounts[id] = (idCounts[id] || 0) + 1

          if (idCounts[id] > 1) {
            id = `${id}-${idCounts[id]}`
            return id
          }

          return id
        })
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
      let hrefCounts = {}
      // Convert cross-refrence links to their proper epub chapter locations
      chapter.links
        .not((index, el) => { return chapter.attrMatches(el, 'href', /^#/) })
        .attr('href', (index, el) => { return chapter.epubLink(el) })

      chapter.links
        .filter((index, el) => { return chapter.attrMatches(el, 'href', /^#/) })
        // Convert to lowercase
        .attr('href', (index, href) => {
          return href.toLowerCase()
        })
        // Decode
        .attr('href', (index, href) => {
          return decodeURIComponent(href)
        })
        // Decode
        .attr('href', (index, href) => {
          return decodeURI(href)
        })
        // Convert any "cover" links to what pandoc see it as "official title"
        .attr('href', (index, href) => {
          return href.replace('#cover', `#${chapter.epubTitle}`)
        })
        // remove special characters except numbers and letters
        .attr('href', (index, href) => {
          return href.replace(/[^a-zA-Z0-9 ]/g, " ")
        })
        // replace multiple spaces with a single space
        // remove special characters removes hash so remove the space it occupied 
        .attr('href', (index, href) => {
          href = href.substring(1)
          return href.replace(/\s\s+/g, ' ')
        })
        // Convert any ":" characters in anchor links to "-"
        .attr('href', (index, href) => {
          return href.replace(':', '-')
        })
        // Convert any " " characters in anchor links to "-"
        // prepend string with missing hash symbol 
        .attr('href', (index, href) => {
          return `#${href.replace(/\s/g, "-")}`
        })

      // Find special hrefs and add page title to end
      chapter.links
        .filter((index, el) => { return chapter.attrMatches(el, 'href', /^#/) })
        .attr('href', (index, href) => {
          href = href.substring(1)
          if (href.indexOf('fn-') !== -1 || href.indexOf('fnref-') !== -1 || href.match(/^\d/)) {
            return `#${href}-${chapter.pandocTitle(chapter.title)}`
          }
          return `#${href}`
        })

      // Find duplicate hrefs and increment
      chapter.links
        .filter((index, el) => { return chapter.attrMatches(el, 'href', /^#/) })
        .attr('href', (index, href) => {
          hrefCounts[href] = (hrefCounts[href] || 0) + 1
          if (hrefCounts[href] > 1) {
            href = `${href}-${hrefCounts[href]}`
            return href
          }
          return href
        })

    }

    reformatNumericalIDs()
    reformatIDsWithColons()
    reformatImgSources()
    reformatLinks()
    reformatIDsForPandoc()
    findDupIds()

  }
}

module.exports = Chapter
