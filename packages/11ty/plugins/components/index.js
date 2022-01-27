const components = require('../../_includes/components')
const globalData = require('../globalData')

/**
 * Define components as universal template shortcodes
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  options         options
 */
module.exports = function(eleventyConfig, options) {
  for (const component in components) {
    const context = { eleventyConfig, globalData, page: this.page }
    eleventyConfig.addShortcode(
      component, 
      (...args) => components[component](context, ...args))
  }
}
