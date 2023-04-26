const chalkFactory = require('~lib/chalk')
const { oneLine } = require('~lib/common-tags')
const logger = chalkFactory(`Shortcodes:Annoref`)
/**
 * Annoref Shortcode
 * Link to the annotation or region state of a canvas
 *
 * @param      {Object} params
 * @property   {String} anno Comma-separated list of annotation ids
 * @property   {String} fig Figure ID
 * @property   {String} region Comma-separated, with format "x,y,width,height"
 * @property   {String} text Link text
 *
 * @return     {String}  Anchor tag with link text annotation and region data attributes
 */
module.exports = function (eleventyConfig) {
  const getFigure = eleventyConfig.getFilter('getFigure')
  const markdownify = eleventyConfig.getFilter('markdownify')

  return ({ anno='', fig, index, region='', text='', onscroll }) => {
    const figure = getFigure(fig)
    if (!figure) {
      console.error(`[annoref shortcode] "fig" parameter doesn't correspond to a valid figure id in "figures.yaml". Fig: ${fig}`)
    }
    const annoIds = anno.split(',').map((id) => id.trim())

    if (onscroll) {
      console.warn(
        `onscroll attribute applied to annoref. This feature is under development. Params:`,
        { anno, fig, region, text, onscroll }
      )
      return oneLine`
        <span
          class="annoref"
          data-annotation-ids="${annoIds.join(',')}"
          data-figure-id="${fig}"
          data-on-scroll="true"
          data-region="${region}"
        >${markdownify(text)}</span>
      `
    }

    return oneLine`
      <a
        class="annoref"
        data-annotation-ids="${annoIds.join(',')}"
        data-figure-id="${fig}"
        data-region="${region}"
        data-index="${index}"
      >${markdownify(text)}</a>
    `
  }
}
