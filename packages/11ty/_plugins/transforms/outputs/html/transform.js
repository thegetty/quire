const path = require('path')
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const filterOutputs = require('../filter.js')
const registerWebComponents = require('./web-components')

/**
 * Content transforms for html output
 */
module.exports = function(eleventyConfig, collections, content) {
  /**
   * Remove pages excluded from this output type
   */
  const pages = collections.html.map(({ outputPath }) => outputPath)
  const { ext } = path.parse(this.outputPath)
  content = pages.includes(this.outputPath) ? content : undefined

  if (ext === '.html') {
    const dom = new JSDOM(content)
    /**
     * Remove elements excluded from this output type
     */
    filterOutputs(dom.window.document, 'html')
    /**
     * Add web component script tags to <head>
     */
    registerWebComponents(dom)
    content = dom.serialize()
  }

  return content
}
