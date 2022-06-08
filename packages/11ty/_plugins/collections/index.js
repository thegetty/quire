const {
  currentOutputFilter,
  menuFilter,
  tableOfContentsFilter,
} = require('../../helpers/page-filters')

/**
 * Add custom collections
 * @param  {Object} eleventyConfig
 * @param  {Object} options
 */
module.exports = function (eleventyConfig, options = {}) {
  /**
   * Collection of pages for the current output (epub, html, or pdf)
   */
  eleventyConfig.addCollection('current', function (collectionApi) {
    return collectionApi.getAll().filter(({ data }) => currentOutputFilter(data))
  })
  /**
   * Collection of pages to display in the menu
   */
  eleventyConfig.addCollection('menu', function (collectionApi) {
    return collectionApi.getAll().filter(({ data }) => menuFilter(data))
  })
  /**
   * Collection of pages to display in Table of Contents
   */
  eleventyConfig.addCollection('tableOfContents', function (collectionApi) {
    return collectionApi.getAll().filter(({ data }) => tableOfContentsFilter(data))
  })
}
