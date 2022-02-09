const components = require('../../_includes/components')

/**
 * Define components as universal template shortcodes
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  options         options
 */
module.exports = function(eleventyConfig, options) {
  for (const component in components) {
    eleventyConfig.addShortcode(component, function(...args) {
      return components[component](eleventyConfig, ...args)
    })
  }
}
