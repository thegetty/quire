const chalkFactory = require('~lib/chalk')
const { oneLine } = require('~lib/common-tags')
const logger = chalkFactory(`Shortcodes:ref`)
const path = require('path')

/**
 * ref Shortcode
 * Link to the annotation or region state of a canvas
 *
 * @param      {Object} params
 * @property   {String} anno Comma-separated list of annotation ids
 * @property   {String} fig Figure ID
 * @property   {String} region Comma-separated, with format "x,y,width,height"
 * @property   {String} sequenceTransitionSpeed The amount of time in ms between transitions to a new index in the sequence
 * @property   {String} start The filename of the item in an image sequence to start on
 * @property   {String} text Link text
 *
 * @return     {String}  Anchor tag with link text annotation and region data attributes
 */
module.exports = function (eleventyConfig) {
  const getFigure = eleventyConfig.getFilter('getFigure')
  const markdownify = eleventyConfig.getFilter('markdownify')

  const { sequenceTransitionSpeed: defaultSequenceTransitionSpeed } = eleventyConfig.globalData.config.ref || {}

  return (params) => {
    const { anno='', fig, region='', start, text='', onscroll } = params
    const figure = getFigure(fig)
    if (!figure) {
      logger.error(`[ref shortcode] "fig" parameter doesn't correspond to a valid figure id in "figures.yaml". Fig: ${fig}`)
    }

    /**
     * Annotations
     */
    const annoIds = anno.split(',').map((id) => id.trim())

    /**
     * Image sequences
     */
    const { isSequence, sequences, startCanvasIndex } = figure
    const { files, transitionSpeed: figureTransitionSpeed, viewingDirection } = isSequence && sequences[0] || {}
    const sequenceLength = isSequence && files.length
    const sequenceTransitionSpeed = params.sequenceTransitionSpeed || figureTransitionSpeed || defaultSequenceTransitionSpeed

    /**
     * Get the index of the filename provided in the start parameter
     */
    const findStartIndex = (start) => {
      return files.findIndex((file) => file && path.parse(file).name === start)
    }
    const startIndex = start && isSequence ? findStartIndex(start) : startCanvasIndex

    if (onscroll) {
      return oneLine`
        <span
          class="ref"
          data-annotation-ids="${annoIds.join(',')}"
          data-figure-id="${fig}"
          data-on-scroll="true"
          data-region="${region}"
          data-sequence-index="${startIndex}"
          data-sequence-length="${sequenceLength}"
          data-sequence-transition-speed="${sequenceTransitionSpeed}"
          data-sequence-viewing-direction="${viewingDirection}"
        >${markdownify(text)}</span>
      `
    }

    return oneLine`
      <a
        class="ref"
        data-annotation-ids="${annoIds.join(',')}"
        data-figure-id="${fig}"
        data-region="${region}"
        data-sequence-index="${startIndex}"
        data-sequence-length="${sequenceLength}"
        data-sequence-transition-speed="${sequenceTransitionSpeed}"
        data-sequence-viewing-direction="${viewingDirection}"
      >${markdownify(text)}</a>
    `
  }
}
