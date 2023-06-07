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

  const { sequenceTimeout: defaultSequenceTimeout } = eleventyConfig.globalData.config.annoref || {}

  return ({ anno='', fig, index, region='', sequenceTimeout=defaultSequenceTimeout, text='', onscroll }) => {
    const figure = getFigure(fig)
    if (!figure) {
      logger.error(`[annoref shortcode] "fig" parameter doesn't correspond to a valid figure id in "figures.yaml". Fig: ${fig}`)
    }

    const { sequences, startCanvasIndex } = figure

    const { viewingDirection, files } = Array.isArray(sequences) && sequences[0] || {}
    const sequenceLength = Array.isArray(files) && files.length

    const annoIds = anno.split(',').map((id) => id.trim())
    const startIndex = index || startCanvasIndex

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
          data-sequence-index="${startIndex}"
          data-sequence-length="${sequenceLength}"
          data-sequence-timeout="${sequenceTimeout}"
          data-sequence-viewing-direction="${viewingDirection}"
        >${markdownify(text)}</span>
      `
    }

    return oneLine`
      <a
        class="annoref"
        data-annotation-ids="${annoIds.join(',')}"
        data-figure-id="${fig}"
        data-region="${region}"
        data-sequence-index="${startIndex}"
        data-sequence-length="${sequenceLength}"
        data-sequence-timeout="${sequenceTimeout}"
        data-sequence-viewing-direction="${viewingDirection}"
      >${markdownify(text)}</a>
    `
  }
}
