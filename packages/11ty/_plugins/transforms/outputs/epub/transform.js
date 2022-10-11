const path = require('path')
const jsdom = require('jsdom')
const layout = require('./layout')
const write = require('./write')
const { JSDOM } = jsdom
const filterOutputs = require('../filter.js')

/**
 * Content transforms for EPUB output
 */
module.exports = function(eleventyConfig, collections, content) {
  const slugify = eleventyConfig.getFilter('slugify')
  const { language } = eleventyConfig.globalData.publication

  /**
   * Remove pages excluded from this output type
   */
  const epubPages = collections.epub.map(({ outputPath }) => outputPath)
  const { ext } = path.parse(this.outputPath)
  const index = epubPages.findIndex((path) => path == this.outputPath)
  let epubContent =  index !== -1 ? content : undefined

  if (epubContent && ext === '.html') {
    const { document } = new JSDOM(epubContent).window
    const mainElement = document.querySelector('main[data-output-path]')
    const title = document.querySelector('title').innerHTML
    const body = document.createElement('body')
    body.innerHTML = mainElement.innerHTML
    body.setAttribute('id', mainElement.getAttribute('id'))
    /**
     * Remove elements excluded from this output type
     */
    filterOutputs(body, 'epub')

    const name = slugify(this.url) || path.parse(this.inputPath).name
    const targetLength = collections.epub.length.toString().length
    const sequence = index.toString().padStart(targetLength, 0)
    epubContent = layout({ body: body.outerHTML, language, title })
    const filename = `${sequence}_${name}.xhtml`
    write(filename, epubContent)
  }

  /**
   * Return unmodified content
   */
  return content
}
