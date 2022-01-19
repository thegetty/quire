const globalData = require('../globalData')

const capitalize = require('./capitalize')
const getContributor = require('./getContributor')
const getFigure = require('./getFigure')
const getObject = require('./getObject')
const json = require('./json')
const lookup = require('./lookup')

module.exports = function(eleventyConfig, options) {
  // @see https://www.11ty.dev/docs/filters/#universal-filters

  eleventyConfig.addFilter('capitalize', (string) => capitalize(string))

  eleventyConfig.addFilter('get', function(content, ...args) {
    const context = { eleventyConfig, globalData, page: this.page }
    return lookup(context, ...args)
  })

  eleventyConfig.addFilter('getContributor', (id) => getContributor(eleventyConfig, globalData, id))

  eleventyConfig.addFilter('keywords', () => keywords(eleventyConfig, globalData))

  eleventyConfig.addFilter('json', (string) => json(string))

}
