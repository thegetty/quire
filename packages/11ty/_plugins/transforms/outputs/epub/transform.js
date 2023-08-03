const filterOutputs = require('../filter.js')
const jsdom = require('jsdom')
const layout = require('./layout')
const path = require('path')
const writer = require('./writer')

const { JSDOM } = jsdom

/**
 * Content transforms for EPUB output
 */
module.exports = function(eleventyConfig, collections, content) {
  const pageTitle = eleventyConfig.getFilter('pageTitle')
  const removeHTML = eleventyConfig.getFilter('removeHTML')
  const slugify = eleventyConfig.getFilter('slugify')
  const slugifyIds = eleventyConfig.getFilter('slugifyIds')
  const { imageDir } = eleventyConfig.globalData.config.figures
  const { outputPath: iiifOutputDir } = eleventyConfig.globalData.iiifConfig.dirs
  const { language } = eleventyConfig.globalData.publication
  const { assets, readingOrder } = eleventyConfig.globalData.epub
  const { outputDir } = eleventyConfig.globalData.config.epub

  const write = writer(outputDir)

  /**
   * Gather asset filepaths
   *
   * @param      {HTMLElement}  element
   */
  const getAssets = (element) => {
    const images = element.querySelectorAll('img')
    images.forEach((img) => {
      const src = img.getAttribute('src')
      if (!src) return
      const pattern = `^(${imageDir}|/${iiifOutputDir})`
      const regex = new RegExp(pattern, 'g')
      if (src.match(regex)) {
        const relativePath = src.replace(/^\//, '')
        assets.push(relativePath)
      }
    })
  }

  /**
   * Remove pages excluded from this output type
   */
  const epubPages = collections.epub.map(({ outputPath }) => outputPath)
  const { ext } = path.parse(this.outputPath)
  const index = epubPages.findIndex((path) => path == this.outputPath)
  let epubContent =  index !== -1 ? content : undefined

  if (epubContent && ext === '.html') {
    const page = collections.epub[index]
    const { document, window } = new JSDOM(epubContent).window
    const mainElement = document.querySelector('main[data-output-path]')

    const title = removeHTML(pageTitle(page.data))
    const body = document.createElement('body')
    body.innerHTML = mainElement.innerHTML
    body.setAttribute('id', mainElement.dataset.pageId)

    /**
     * Remove elements excluded from this output type
     */
    filterOutputs(body, 'epub')
    getAssets(body)

    /**
     * Add epub-specific attributes to TOC element
     */
    const tableOfContents = body.querySelector('.table-of-contents')
    if (tableOfContents) {
      tableOfContents.setAttribute('role', 'doc-toc')
      tableOfContents.setAttribute('epub:type', 'toc')
    }

    const targetLength = collections.epub.length.toString().length

    /**
     * Rewrite relative web links to work properly in epub readers
     */
    const linkElements = body.querySelectorAll('a')
    linkElements.forEach((linkElement) => {
      const href = linkElement.getAttribute('href')
      if (!href) return

      /**
       * Determine if a URL points to an internal page
       *
       * @param      {String}  href
       * @return     {Boolean}
       */
      const isPageLink = (href) => {
        return !href.startsWith('#') && !href.startsWith('http')
      }
      if (!isPageLink(href)) return

      const index = collections.epub
        .findIndex(({ url }) => url === href)

      if (index === -1) return

      const { url } = collections.epub[index]
      const sequenceNumber = index.toString().padStart(targetLength, 0)
      const filename = `${sequenceNumber}_${slugify(url)}.xhtml`
      linkElement.setAttribute('href', filename)
    })

    /**
     * Sequence and write files
     */
    const name = slugify(this.url) || path.parse(this.inputPath).name
    const sequence = index.toString().padStart(targetLength, 0)

    const serializer = new window.XMLSerializer()
    slugifyIds(document)
    const xml = serializer.serializeToString(body)

    epubContent = layout({ body: xml, language, title })

    const filename = `${sequence}_${name}.xhtml`
    const item = {
      url: filename,
      encodingFormat: 'application/xhtml+xml'
    }

    switch (page.data.layout) {
      case 'table-of-contents':
        item.rel = 'contents'
        break
      case 'cover':
        item.rel = 'cover'
        break
    }

    readingOrder.push(item)

    write(filename, epubContent)
  }

  /**
   * Return unmodified content
   */
  return content
}
