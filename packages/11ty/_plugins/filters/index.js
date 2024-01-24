// Quire data filters
import fullname from './fullname'
import getAnnotation from './getAnnotation'
import getContributor from './getContributor'
import getFigure from './getFigure'
import getObject from './getObject'
import initials from './initials'
import keywords from './keywords'
import sortContributors from './sortContributors'
import sortReferences from './sortReferences'

// string filters
import capitalize from './capitalize'
import json from './json'
import removeHTML from './removeHTML'
import slugifyIds from './slugifyIds'
import titleCase from './titleCase'

// utility filters
import sortByKeys from './sortByKeys'

// Web component rendering
import renderWebcComponent from './renderWebcComponent'

/**
 * Add universal filters for use in templates
 * @see https://www.11ty.dev/docs/filters/#universal-filters
 */
export default function(eleventyConfig, options) {
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
