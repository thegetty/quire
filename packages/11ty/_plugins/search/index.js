/**
 * An Eleventy plugin for full-text search
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  [options]       search engine options
 */
module.exports = function(eleventyConfig, options) {
  /**
   * Copy search module to the output directory
   * @see {@link https://www.11ty.dev/docs/copy/ Passthrough copy in 11ty}
   * @todo set output destination to 'js/search'
   */
  eleventyConfig.addPassthroughCopy('plugins/search/search.js')
}
