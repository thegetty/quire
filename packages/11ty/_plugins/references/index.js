/**
 * An Eleventy plugin to add a `sortReferences` universal template filter.
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 */
module.exports = function(eleventyConfig) {
  eleventyConfig.addFilter('sortReferences', (content) => {
    if (!content || !Array.isArray(content)) return null

    return content.sort((a, b) => {
      const sortA = a.sort || a.full
      const sortB = b.sort || b.full

      switch (true) {
        case (sortA < sortB):
          return -1;
        case (sortA > sortB):
          return 1;
        default:
          return 0
      }
    })
  })
}
