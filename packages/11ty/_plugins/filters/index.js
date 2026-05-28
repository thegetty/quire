import memoize from 'memoize'
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
  eleventyConfig.addFilter('fullname', memoize((person, options) => fullname(person, options)))
  eleventyConfig.addFilter('getAnnotation', memoize((...args) => getAnnotation(eleventyConfig, ...args)))
  eleventyConfig.addFilter('getContributor', memoize((id) => getContributor(eleventyConfig, id)))
  eleventyConfig.addFilter('getFigure', memoize((id) => getFigure(eleventyConfig, id)))
  eleventyConfig.addFilter('getObject', memoize((id) => getObject(eleventyConfig, id)))
  eleventyConfig.addFilter('initials', memoize((person, options) => initials(person, options)))
  eleventyConfig.addFilter('keywords', memoize(() => keywords(eleventyConfig)))
  eleventyConfig.addFilter('sortContributors', memoize((contributors) => sortContributors(eleventyConfig, contributors)))
  eleventyConfig.addFilter('sortReferences', memoize((items) => sortReferences(eleventyConfig, items)))
  /**
   * String manipulation filters
   */
  eleventyConfig.addFilter('capitalize', memoize((string) => capitalize(string)))
  eleventyConfig.addFilter('json', memoize((string) => json(string)))
  eleventyConfig.addFilter('removeHTML', memoize((string) => removeHTML(string)))
  eleventyConfig.addFilter('slugifyIds', memoize((string) => slugifyIds(string, eleventyConfig)))
  eleventyConfig.addFilter('titleCase', memoize((string) => titleCase(string)))
  /**
   * Web component rendering
   */
  eleventyConfig.addFilter('renderWebcComponent', renderWebcComponent)
  /**
   * Utilities
   */
  eleventyConfig.addFilter('sortByKeys', sortByKeys)
}
