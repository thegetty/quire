const { oneLine } = require('common-tags');

/**
 * Template for the "Cite this Page" feature. Called as a
 * shortcode, such as:
 *
 * {% "citation", type: "chicago", context: "page" %}
 *
 * Follows standard of using "et al" for more than ten
 * authors in Chicago citations, and more than two authors
 * in MLA citations.
 *
 * @param  {Object} eleventyConfig
 * @param  {Object} params
  * @property  {String} context - "page" or "publication"
 * @property  {Object} page
 * @property  {String} type - "chicago" or "mla"
 * 
 * @return {String}                citation markup
 */
module.exports = function(eleventyConfig) {
  const chicagoPage = eleventyConfig.getFilter('chicagoPage')
  const chicagoPublication = eleventyConfig.getFilter('chicagoPublication')
  const MLAPage = eleventyConfig.getFilter('MLAPage')
  const MLAPublication = eleventyConfig.getFilter('MLAPublication')

  return function (params) {
    const { context, page, type } = params
    if (!type) {
      console.warn(`"type" is required for the citation shortcode. Options are: "chicago" or "mla"`)
      return ''
    }
    if (!context) {
      console.warn(`"context" is required for the citation shortcode. Options are: "page" or "publication"`)
      return ''
    }

    const shortcodes = {
      chicago: {
        page: chicagoPage({ page }),
        publication: chicagoPublication()
      },
      mla: {
        page: MLAPage({ page }),
        publication: MLAPublication()
      }
    }

    return oneLine`${shortcodes[type][context]}`
  }
}
