const globalData = require('../globalData')
const liquidTag = require('./liquidTag')

const components = require('../../_includes/components')

/**
 * Define components as universal template shortcodes
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  options         options
 */
const needsGlobalData = ['icon'];

module.exports = function(eleventyConfig, options) {
  for (const component in components) {
    eleventyConfig.addJavaScriptFunction(component, function(...args) {
      return components[component](eleventyConfig, globalData)(...args)
    })
    liquidTag(eleventyConfig, components[component], `${component}`)
  }
}
