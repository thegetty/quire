import capitalize from './capitalize.js'
import fullname from './fullname.js'
import getAnnotation from './getAnnotation.js'
import getContributor from './getContributor.js'
import getFigure from './getFigure.js'
import getObject from './getObject.js'
import initials from './initials.js'
import json from './json.js'
import keywords from './keywords.js'
import removeHTML from './removeHTML.js'
import renderWebcComponent from './renderWebcComponent.js'
import slugifyIds from './slugifyIds.js'
import sortByKeys from './sortByKeys.js'
import sortContributors from './sortContributors.js'
import sortReferences from './sortReferences.js'
import titleCase from './titleCase.js'

/**
 * Add universal filters for use in templates
 * @see https://www.11ty.dev/docs/filters/#universal-filters
 */
export default function (eleventyConfig, options) {
  /**
   * Quire data filters
   */
  eleventyConfig.addFilter('fullname', (person, options) => fullname(person, options))
  eleventyConfig.addFilter('getAnnotation', (...args) => getAnnotation(eleventyConfig, ...args))
  eleventyConfig.addFilter('getContributor', (id) => getContributor(eleventyConfig, id))
  eleventyConfig.addFilter('getFigure', (id) => getFigure(eleventyConfig, id))
  eleventyConfig.addFilter('getObject', (id) => getObject(eleventyConfig, id))
  eleventyConfig.addFilter('initials', (person, options) => initials(person, options))
  eleventyConfig.addFilter('keywords', () => keywords(eleventyConfig))
  eleventyConfig.addFilter('sortContributors', (contributors) => sortContributors(eleventyConfig, contributors))
  eleventyConfig.addFilter('sortReferences', (items) => sortReferences(eleventyConfig, items))
  /**
   * String manipulation filters
   */
  eleventyConfig.addFilter('capitalize', (string) => capitalize(string))
  eleventyConfig.addFilter('json', (string) => json(string))
  eleventyConfig.addFilter('removeHTML', (string) => removeHTML(string))
  eleventyConfig.addFilter('slugifyIds', (string) => slugifyIds(string, eleventyConfig))
  eleventyConfig.addFilter('titleCase', (string) => titleCase(string))
  /**
   * Web component rendering
   */
  eleventyConfig.addFilter('renderWebcComponent', renderWebcComponent)
  /**
   * Utilities
   */
  eleventyConfig.addFilter('sortByKeys', sortByKeys)
}
