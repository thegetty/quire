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

  // Returning content allows subsequent transforms to process it unmodified
  if (!epubContent || ext !== '.html') return content

  /**
   * Get sequence number, name, and create filename
   */
  const filename = ({ inputPath, url }) => {
    const name = slugify(url) || path.parse(inputPath).name

    // The filename is used as an id attribute, prefix with `page-` to ensure id is valid (does not begin with a number)
    return `page-${name}.xhtml`
  }

  const outputFilename = filename(this)

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

    linkElement.setAttribute('href', filename(collections.epub[index]))
  })

  /**
   * Sequence and write files
   */

  const serializer = new window.XMLSerializer()
  slugifyIds(document)
  const xml = serializer.serializeToString(body)

  epubContent = layout({ body: xml, language, title })

  const item = {
    index,
    encodingFormat: 'application/xhtml+xml',
    url: outputFilename
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

  write(outputFilename, epubContent)

  /**
   * Return unmodified content
   */
  return content
}
