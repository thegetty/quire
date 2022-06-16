const format = require('./format')
const htmlForPdf = require('./html-for-pdf')

/**
 * An Eleventy plugin to configure output transforms
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  options
 */

module.exports = function(eleventyConfig, collections, options = {}) {
  /**
   * Format output using Prettier
   */
  eleventyConfig.addTransform('format', format)
  /**
   * Nota bene:
   * call transform with `this` context to ensure we have `this.outputPath`
   */
  eleventyConfig.addTransform('htmlForPdf', function (content) {
    return htmlForPdf.call(this, collections, content)
  })
}
