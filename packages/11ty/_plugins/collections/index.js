const shouldBuildPage = require('../../helpers/should-build-page')
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
    return collectionApi
      .getAll()
      .filter((page) => shouldBuildPage(page.data.outputs))
  })
  /**
   * Collection of pages to display in the menu
   */
  eleventyConfig.addCollection('menu', function (collectionApi) {
    return collectionApi.getAll('current').filter((page) => {
      const { menu, outputs, type } = page.data
      return shouldBuildPage(outputs) && menu !== false && type !== 'data'
    })
  })
  /**
   * Collection of pages to display in Table of Contents
   */
  eleventyConfig.addCollection('tableOfContents', function (collectionApi) {
    return collectionApi.getAll('current').filter((page) => {
      const { outputs, toc, type } = page.data
      return shouldBuildPage(outputs) && toc !== false && type !== 'data'
    })
  })
}
