const { oneLineCommaLists } = require('common-tags')

/**
 *  Generates markdown for an inline list of anchor links to figure references on the page.
 *
 *  @example
 *    {% q-ref 'fig-4', 'fig-5', 'fig-6', 'fig-7' %}
 *
 *    (fig. [4](#fig-4), [5](#fig-5), [6](#fig-6), [7](#fig-7))
 */
module.exports = function(eleventyConfig, globalData, figures=[]) {
  figures.map((id) => `[${id}](#${id})`)

  return oneLineCommaLists`(fig. ${figures})`
}
