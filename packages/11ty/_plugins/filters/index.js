// Quire data filters
const figureIIIF = require('./figureIIIF')
const fullname = require('./fullname')
const getContributor = require('./getContributor')
const getFigure = require('./getFigure')
const getObject = require('./getObject')
const hasCanvasPanelProps = require('./hasCanvasPanelProps')
const initials = require('./initials')
const isImageService = require('./isImageService')
const sortContributors = require('./sortContributors')
const sortReferences = require('./sortReferences')

// string filters
const capitalize = require('./capitalize')
const json = require('./json')
const pluralize = require('./pluralize')
const removeHTML = require('./removeHTML')
const titleCase = require('./titleCase')

/**
 * Add universal filters for use in templates
 * @see https://www.11ty.dev/docs/filters/#universal-filters
 */
module.exports = function(eleventyConfig, options) {
  /**
   * Quire data filters
   */
  eleventyConfig.addFilter('figureIIIF', (figure, options) => figureIIIF(eleventyConfig, figure, options))

  eleventyConfig.addFilter('fullname', (person, options) => fullname(person, options))

  eleventyConfig.addFilter('initials', (person, options) => initials(person, options))

  eleventyConfig.addFilter('getContributor', (id) => getContributor(eleventyConfig, id))

  eleventyConfig.addFilter('getFigure', (id) => getFigure(eleventyConfig, id))

  eleventyConfig.addFilter('getObject', (id) => getObject(eleventyConfig, id))

  eleventyConfig.addFilter('hasCanvasPanelProps', (figure, options) => hasCanvasPanelProps(figure, options))

  eleventyConfig.addFilter('isImageService', (figure, options) => isImageService(figure, options))

  eleventyConfig.addFilter('keywords', () => keywords(eleventyConfig))

  eleventyConfig.addFilter('sortContributors', (contributors) => sortContributors(eleventyConfig, contributors))

  eleventyConfig.addFilter('sortReferences', (items) => sortReferences(eleventyConfig, items))

  /**
   * String manipulation filters
   */
  eleventyConfig.addFilter('capitalize', (string) => capitalize(string))

  eleventyConfig.addFilter('titleCase', (string) => titleCase(string))

  eleventyConfig.addFilter('json', (string) => json(string))

  eleventyConfig.addFilter('pluralize', (string, count) => pluralize(string, count))

  eleventyConfig.addFilter('removeHTML', (string) => removeHTML(string))
}
