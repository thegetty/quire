const write = require('./write')
/**
 * An Eleventy plugin for full-text search
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  [options]       search engine options
 */
module.exports = function(eleventyConfig, collections, options) {
  /**
   * Copy search module and write index to the output directory
   * @see {@link https://www.11ty.dev/docs/copy/ Passthrough copy in 11ty}
   * @todo set output destination to 'js/search'
   */
  eleventyConfig.addPassthroughCopy('plugins/search/search.js')

  /**
   * Write index
   */
  eleventyConfig.on('eleventy.after', async () => {
    write(collections)
  })
}
