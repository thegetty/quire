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
    return htmlForPdf(collections, content)
  })
}
