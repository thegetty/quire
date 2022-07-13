const jsdom = require('jsdom')
const { JSDOM } = jsdom
const filterOutputs = require('../filter.js')

/**
 * Content transforms for html output
 */
module.exports = function(eleventyConfig, collections, content) {
  /**
   * Remove pages excluded from this output type
   */
  const pages = collections.html.map(({ outputPath }) => outputPath)
  content = pages.includes(this.outputPath) ? content : undefined

  /**
   * Remove elements excluded from this output type
   */
  const dom = new JSDOM(content)
  filterOutputs(dom.window.document, 'html')
  return dom.serialize()
}
