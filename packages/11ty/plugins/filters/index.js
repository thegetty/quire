const globalData = require('../globalData')

const capitalize = require('./capitalize')
const fullname = require('./fullname')
const getContributor = require('./getContributor')
const getFigure = require('./getFigure')
const getObject = require('./getObject')
const json = require('./json')

module.exports = function(eleventyConfig, options) {
  // @see https://www.11ty.dev/docs/filters/#universal-filters

  eleventyConfig.addFilter('capitalize', (string) => capitalize(string))

  eleventyConfig.addFilter('fullname', (person, options) => fullname(person, options))

  eleventyConfig.addFilter('getContributor', (id) => getContributor(eleventyConfig, globalData, id))

  eleventyConfig.addFilter('getFigure', (id) => getFigure(eleventyConfig, globalData, id))

  eleventyConfig.addFilter('getObject', (id) => getObject(eleventyConfig, globalData, id))

  eleventyConfig.addFilter('keywords', () => keywords(eleventyConfig, globalData))

  eleventyConfig.addFilter('json', (string) => json(string))
}
