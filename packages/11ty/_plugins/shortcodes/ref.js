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
 * @property   {String} transition The amount of time in ms between transitions to a new index in the sequence
 * @property   {String} start The filename of the item in an image sequence to start on
 * @property   {String} text Link text
 *
 * @return     {String}  Anchor tag with link text annotation and region data attributes
 */
module.exports = function (eleventyConfig) {
  const getFigure = eleventyConfig.getFilter('getFigure')
  const markdownify = eleventyConfig.getFilter('markdownify')

  const { sequenceTransition: defaultSequenceTransition } = eleventyConfig.globalData.config.ref || {}

  return (params) => {
    const { anno='', fig, region='', start, onscroll } = params

    const figure = getFigure(fig)
    if (!figure) {
      logger.error(`[ref shortcode] "fig" parameter doesn't correspond to a valid figure id in "figures.yaml". Fig: ${fig}`)
    }

    const text = params.text ? params.text : figure.label

    /**
     * Annotations
     */
    const annoIds = anno.split(',').map((id) => id.trim())

    /**
     * Image sequences
     */
    const { id, isSequence, sequences, startCanvasIndex } = figure
    const { files, transition: figureTransition } = isSequence && sequences[0] || {}
    const transition = params.transition || figureTransition || defaultSequenceTransition

    /**
     * Get the index of the filename provided in the start parameter
     */
    const findStartIndex = (start) => {
      return files.findIndex((file) => file && path.parse(file).name === start)
    }
    const startIndex = start && isSequence ? findStartIndex(start) : startCanvasIndex

    if (isSequence && startIndex === -1) {
      logger.error(`[ref shortcode] The "start" value must correspond to the filename of an image in the figure sequence. figure "${id}" does not contain an image in the sequence with the name "${start}".`)
    }

    if (onscroll) {
      return oneLine`
        <span
          class="ref"
          data-annotation-ids="${annoIds.join(',')}"
          data-figure-id="${fig}"
          data-on-scroll="true"
          data-region="${region}"
          data-sequence-index="${startIndex}"
          data-sequence-transition="${transition}"
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
        data-sequence-transition="${transition}"
      >${markdownify(text)}</a>
    `
  }
}
