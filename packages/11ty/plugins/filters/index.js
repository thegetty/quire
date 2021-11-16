const globalData = require('../globalData')

const capitalize = require('./capitalize')
const getFigure = require('./getFigure')

module.exports = function(eleventyConfig, options) {
  // @see https://www.11ty.dev/docs/filters/#universal-filters

  eleventyConfig.addFilter('capitalize', (string) => capitalize(string))
  eleventyConfig.addFilter('getFigure', (id) => getFigure(eleventyConfig, globalData, id))
}
