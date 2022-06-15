const format = require('./format')
const htmlForPdf = require('./html-for-pdf')

/**
 * An Eleventy plugin to configure output transforms
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  options
 */

module.exports = function(eleventyConfig, collections, options = {}) {
  // eleventyConfig.addTransform('format', format)
  eleventyConfig.addTransform('htmlForPdf', function(content) {
    /**
     * Nota bene:
     * call transform with `this` context to ensure we have `this.outputPath`
     */
    return htmlForPdf.call(this, collections, content)
  })
}
