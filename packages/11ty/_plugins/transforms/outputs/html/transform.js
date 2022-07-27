const path = require('path')
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
  const { ext } = path.parse(this.outputPath)
  content = pages.includes(this.outputPath) ? content : undefined

  /**
   * Remove elements excluded from this output type
   */
  if (ext === '.html') {
    const dom = new JSDOM(content)
    filterOutputs(dom.window.document, 'html')
    content = dom.serialize()
  }

  return content
}
