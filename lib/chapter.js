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
    this.reformatedHashLinkArr = ''
    this.reformatPage()

    let data = {
      title: this.title,
      body: this.body(),
      toc: true,
      reformatedHashLinkArr: this.reformatedHashLinkArr
    }

    if (this.href()) {
      data.linkTitleArr = {}
      data.href = this.href()
      // linkTitleArr = Object that contains the chapter internal link and chapter title
      data.linkTitleArr['link'] = this.santizeUrl(this.href())
      data.linkTitleArr['title'] = this.pandocTitle(this.title)
    }
    return data
  }

  santizeUrl(url) {
    if (url !== undefined) {
      url = url
        // lowercase string
        .toLowerCase()
        // trim string
        .trim()
        // remove .xhtml
        .replace('.xhtml', '')
        // replace first instance of / with ''
        .replace(/^\//, '')
        // replace last instance of / with ''
        .replace(/\/$/, '')
        // replace all instances of . with ''
        .replace(/\./g, '')
      return url
    }
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

    // if external link we dont want it
    if (href.match(/^(https|http|www)/)) {
      return href
    }

    // if internal link we dont want it
    if (href.indexOf('#') !== -1) {
      return href
    }

    let chapterName = upath
      .normalize(href.replace('localhost:1313', ''))
      // replace first instance of / with ''
      .replace(/^\//, '')
      // replace last instance of / with ''
      .replace(/\/$/, '')
      // replace all instances of . with ''
      .replace(/\./g, '')
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
        // Deal with footnote and footnote return ids
        .attr('id', (index, id) => {
          if (id.indexOf('fn-') !== -1 || id.indexOf('fnref-') !== -1) {
            return `${id}-${chapter.pandocTitle(chapter.title)}`
          }
          return `${id}`
        })
    }

    // Find duplicate ids and increment
    /*
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
    */

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
      let hrefArr = []

      // Convert cross-refrence links to their proper epub chapter locations
      chapter.links
        .not((index, el) => {
          return chapter.attrMatches(el, 'href', /^#/)
        })
        .attr('href', (index, href) => {
          // console.log(href)
          return chapter.epubLink(href)
        })

      // This routine deals with internal links that link to another page in the EPUB
      chapter.links
        .filter((index, el) => {
          return chapter.$(el).attr('href').indexOf('#') !== -1
        })
        .filter((index, el) => {
          return chapter.$(el).attr('href').charAt(0) !== '#'
        })
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
        .attr('href', (index, href) => {
            href = href.replace('//localhost:1313', '')
              // replace first instance of / with ''
              .replace(/^\//, '')
              // replace last instance of / with ''
              .replace(/\/$/, '')
              // replace : with '-'
              .replace(':', '-')
              // replace : with '-'
              .replace('.', '-')
              // replace any whitespace with -
              .replace(/\s/g, "-")
            return `${href}`
        })


      // Reformat internal links that are linked to the same chapter
      chapter.links
        .filter((index, el) => {
          // console.log(chapter.$(el).attr('href').indexOf('#') !== -1)
          return chapter.attrMatches(el, 'href', /^#/)
        })
        .filter((index, el) => {
          // console.log(chapter.$(el).attr('href').indexOf('#') !== -1)
          return chapter.$(el).attr('href').indexOf('/') === -1
        })
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
        // remove special characters removes hash character so remove the space it occupied 
        .attr('href', (index, href) => {
          href = href.substring(1)
          return href.replace(/\s\s+/g, ' ')
        })
        // Convert any ":" characters in anchor links to "-"
        .attr('href', (index, href) => {
          return href.replace(':', '-')
        })
        // Convert any " " characters in anchor links to "-"
        // prepend string with missing hash character 
        .attr('href', (index, href) => {
          href = href.replace(/\s/g, "-")
          hrefArr.push({'internalLinks':`#${href}`})
          return `#${href}`
        })

      // footnote internal links that are on the same page and add page title to end
      chapter.links
        .filter((index, el) => { return chapter.attrMatches(el, 'href', /^#/) })
        .attr('href', (index, href) => {
          href = href.substring(1)
          if (href.indexOf('fn-') !== -1 || href.indexOf('fnref-') !== -1) {
            hrefArr.push({'footnoteInternalLinks':`#${href}-${chapter.pandocTitle(chapter.title)}`})
            return `#${href}-${chapter.pandocTitle(chapter.title)}`
          }
          return `#${href}`
        })

      // Find duplicate hrefs and increment on contents page
      if (chapter.pandocTitle(chapter.title) === `contents`) {
        chapter.links
          .filter((index, el) => { return chapter.attrMatches(el, 'href', /^#/) })
          .attr('href', (index, href) => {
            hrefCounts[href] = (hrefCounts[href] || 0) + 1
            if (hrefCounts[href] > 1) {
              hrefArr.push({'tocInternalLinks':`${href}-${hrefCounts[href]}`})
              href = `${href}-${hrefCounts[href]}`
              return href
            }
            return href
          })
      }
      
      // Array of internal links to cross ref in build.js
      chapter.reformatedHashLinkArr = hrefArr
    }

    reformatNumericalIDs()
    reformatIDsWithColons()
    reformatImgSources()
    reformatLinks()
    reformatIDsForPandoc()
    // findDupIds()

  }
}

module.exports = Chapter
