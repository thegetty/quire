const pdf = require('./pdf')

/**
 * An Eleventy plugin to configure output transforms
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  options
 */

module.exports = function(eleventyConfig, collections, options = {}) {
  eleventyConfig.addTransform('pdf', function(content) {
    return pdf(collections, content)
  })
}
