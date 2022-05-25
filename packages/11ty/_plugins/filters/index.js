const capitalize = require('./capitalize')
const figureIIIF = require('./figureIIIF')
const fullname = require('./fullname')
const initials = require('./initials')
const getContributor = require('./getContributor')
const getFigure = require('./getFigure')
const getObject = require('./getObject')
const hasCanvasPanelProps = require('./hasCanvasPanelProps')
const isImageService = require('./isImageService')
const json = require('./json')
const removeHTML = require('./removeHTML')

module.exports = function(eleventyConfig, options) {
  // @see https://www.11ty.dev/docs/filters/#universal-filters

  eleventyConfig.addFilter('capitalize', (string) => capitalize(string))

  eleventyConfig.addFilter('figureIIIF', (figure, options) => figureIIIF(eleventyConfig, figure, options))

  eleventyConfig.addFilter('fullname', (person, options) => fullname(person, options))

  eleventyConfig.addFilter('initials', (person, options) => initials(person, options))

  eleventyConfig.addFilter('getContributor', (id) => getContributor(eleventyConfig, id))

  eleventyConfig.addFilter('getFigure', (id) => getFigure(eleventyConfig, id))

  eleventyConfig.addFilter('getObject', (id) => getObject(eleventyConfig, id))

  eleventyConfig.addFilter('hasCanvasPanelProps', (figure, options) => hasCanvasPanelProps(figure, options))

  eleventyConfig.addFilter('isImageService', (figure, options) => isImageService(figure, options))

  eleventyConfig.addFilter('keywords', () => keywords(eleventyConfig))

  eleventyConfig.addFilter('json', (string) => json(string))

  eleventyConfig.addFilter('removeHTML', (string) => removeHTML(string))
}
