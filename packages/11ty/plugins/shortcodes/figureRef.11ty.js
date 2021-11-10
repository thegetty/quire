const { oneLineCommaLists } = require('common-tags')

/**
 *  Generates markdown for an inline list of anchor links to figure references on the page.
 *
 *  @example
 *    ({% q-ref 'fig-4', 'fig-5', 'fig-6', 'fig-7' %})
 *
 *    (fig. [4](#fig-4), [5](#fig-5), [6](#fig-6), [7](#fig-7))
 */
module.exports = function(ids=[]) {
  const fig = 'fig.'

  // parse the string of figure identifiers
  ids = ids.split(',').map((id) => {
    id = id.trim()
    const text = id.replace('fig-', '')
    return `[${text}](#${id})`
  })

  if (!ids.length) {
    console.warn(`Error: NoId: the q-ref shortcode must include one or more 'id' values that correspond to the 'id' of a figure on the page. @example {% q-ref 'fig-1', 'fig-7', 'fig-11' %}`)
  }

  console.log(ids)

  return oneLineCommaLists`${fig} ${ids}`
}
