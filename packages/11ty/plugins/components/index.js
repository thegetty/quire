const globalData = require('../globalData')
const liquidArgs = require('liquid-args')
const liquidTag = require('./liquidTag')
// const { Liquid, Hash } = require('liquidjs')
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
      return components[component](globalData)(...args)
    })
    liquidTag(eleventyConfig, components[component], `${component}`)
  }
}
