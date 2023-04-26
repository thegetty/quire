const { html } = require('~lib/common-tags')
const chalkFactory = require('~lib/chalk')

/**
 * SequencePanel shortcode that renders the Digirati <sequence-panel> web component
 * @see {@link https://iiif-canvas-panel.netlify.app/docs/api-reference/sequence-panel/ Sequence Panel Documentation}
 */
module.exports = function(eleventyConfig) {
  const logger = chalkFactory('shortcodes:sequence-panel')

  /**
   * Sequence Panel Shortcode
   *
   * @param  {Object} params `figure` data from `figures.yaml`
   * @property  {String} id The id property of the figure in figures.yaml
   * @property  {String} manifestId The id of the manifest to render
   * @property  {String} preset <sequence-panel> preset {@link https://iiif-canvas-panel.netlify.app/docs/examples/responsive-image#presets}
   * @property  {String} startCanvas The id of the canvas to display first in the sequence
   *
   * @return {String}        <sequence-panel> markup
   */
  return function(data) {
    const {
      height='',
      id,
      manifestId,
      margin='',
      preset='static',
      startCanvas,
      textEnabled='false',
      textSelectionEnabled='false',
    } = data

    if (!manifestId) {
      logger.error(`Invalid params for figure "${id}": `, data)
      return ''
    }

    return html`
      <sequence-panel
        id="${id}"
        manifest-id="${manifestId}"
        margin="${margin}"
        preset="${preset}"
        start-canvas="${startCanvas}"
        text-enabled="${textEnabled}"
        text-selection-enabled="${textSelectionEnabled}"
      ></sequence-panel>
    `
  }
}
