const { oneLineCommaListsAnd } = require('~lib/common-tags')
const chalkFactory = require('~lib/chalk')

const logger = chalkFactory('shortcodes:figureRef')

/**
 * Generate markdown for an inline list of links to figures on the page.
 *
 * @example reference a single figure
 *   {% ref 'fig-4' %}
 *  renders the following markdown string
 *   [fig. 4](#fig-4)
 *
 * @example reference two figures
 *   {% ref 'fig-4', 'fig-5' %}
 *  renders the following markdown string
 *   [figs. 4](#fig-4) and [5](#fig-5)
 *
 * @example reference three or more figures
 *   {% ref 'fig-4', 'fig-5', 'fig-6', 'fig-7' %}
 *  renders the following markdown string
 *   [figs. 4](#fig-4), [5](#fig-5), [6](#fig-6), and [7](#fig-7)
 */
module.exports = function(eleventyConfig) {
  return function (ids) {
    if (!ids.length) {
      logger.warn(`NoId: Figure 'ref' shortcode must include one or more values corresponding to the 'id' of a figure on the page. @example {% ref 'fig-1', 'fig-7', 'fig-11' %}`)
    }

    const label = ids.length > 1 ? 'figs.' : 'fig.'

    // transform the array of figure ids into and array of markdown links
    const links = ids.split(',').map((id, index) => {
      id = id.trim()
      let text = id.replace(/^fig-/i, '')
      if (index === 0) text = `${label} ${text}`
      return `[${text}](#${id})`
    })

    return oneLineCommaListsAnd`${links}`
  }
}
