const { oneLineCommaLists } = require('common-tags')

/**
 * Generate markdown for an inline list of links to figures on the page.
 *
 * @example.liquid
 *  ({% ref 'fig-4', 'fig-5', 'fig-6', 'fig-7' %})
 * renders the following markdown
 *  (fig. [4](#fig-4), [5](#fig-5), [6](#fig-6), [7](#fig-7))
 */
module.exports = function(eleventyConfig, globalData) {
  const fig = 'fig.'

  return function (ids) {
    // transform the array of figure ids into and array of markdown links
    const links = ids.split(',').map((id) => {
      id = id.trim()
      const text = id.replace('fig-', '')
      return `[${text}](#${id})`
    })

    if (!ids.length) {
      console.warn(`Error: NoId: the q-ref shortcode must include one or more 'id' values that correspond to the 'id' of a figure on the page. @example {% q-ref 'fig-1', 'fig-7', 'fig-11' %}`)
    }

    return oneLineCommaLists`${fig} ${links}`
  }
}
