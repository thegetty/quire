const path = require('path')
const jsdom = require('jsdom')
const write = require('./write')
const { JSDOM } = jsdom
const filterOutputs = require('../filter.js')

/**
 * Content transforms for EPUB output
 */
module.exports = function(eleventyConfig, collections, content) {
  /**
   * Remove pages excluded from this output type
   */
  const epubPages = collections.epub.map(({ outputPath }) => outputPath)
  const { ext } = path.parse(this.outputPath)
  const index = epubPages.findIndex((path) => path == this.outputPath)
  let epubContent =  index !== -1 ? content : undefined

  if (epubContent && ext === '.html') {
    const dom = new JSDOM(epubContent)
    /**
     * Remove elements excluded from this output type
     */
    filterOutputs(dom.window.document, 'epub')

    const { name } = path.parse(this.inputPath)
    const targetLength = collections.epub.length.toString().length
    const sequence = index.toString().padStart(targetLength, 0)
    const filename = `${sequence}_${name}.html`
    epubContent = dom.serialize()
    write(filename, epubContent)
  }

  /**
   * Return unmodified content
   */
  return content
}
