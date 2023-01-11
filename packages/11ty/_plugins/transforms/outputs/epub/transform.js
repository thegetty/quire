const filterOutputs = require('../filter.js')
const getIIIFConfig = require('../../../figures/iiif/config')
const jsdom = require('jsdom')
const layout = require('./layout')
const path = require('path')
const writer = require('./writer')

const { JSDOM } = jsdom

/**
 * Content transforms for EPUB output
 */
module.exports = function(eleventyConfig, collections, content) {
  const { output: iiifOutputDir } = getIIIFConfig(eleventyConfig).dirs
  const pageTitle = eleventyConfig.getFilter('pageTitle')
  const slugify = eleventyConfig.getFilter('slugify')
  const slugifyIds = eleventyConfig.getFilter('slugifyIds')
  const { imageDir } = eleventyConfig.globalData.config.figures
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
    const title = pageTitle(page.data)
    const body = document.createElement('body')
    body.innerHTML = mainElement.innerHTML
    body.setAttribute('id', mainElement.getAttribute('id'))

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
     * Sequence and write files
     */
    const name = slugify(this.url) || path.parse(this.inputPath).name
    const targetLength = collections.epub.length.toString().length
    const sequence = index.toString().padStart(targetLength, 0)

    const serializer = new window.XMLSerializer()
    const xml = slugifyIds(serializer.serializeToString(body))

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
