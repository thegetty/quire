/**
 * CanvasPanel shortcode that renders the digirati <canvas-panel> web component
 * @see {@link https://iiif-canvas-panel.netlify.app/docs/intro/ Canvas Panel Documentation}
 */
const { html } = require('common-tags')

module.exports = function(eleventyConfig) {
  /**
   * Canvas Panel Shortcode
   * @param  {Object} params `figure` data from `figures.yaml`
   * @property  {String} canvasId The id of the canvas to render
   * @property  {String} choiceId The id of the choice to use as default (optional, and only applicable to canvases with choices)
   * @property  {String} id The id property of the figure in figures.yaml
   * @property  {String} manifestId The id of the manifest to render
   * @property  {String} preset <canvas-panel> preset {@link https://iiif-canvas-panel.netlify.app/docs/examples/responsive-image#presets}
   * @return {String}        <canvas-panel> markup
   */
  return function(params) {
    const { height='', id, iiif, preset='', region='', virtualSizes='', width='' } = params
    const { canvas, choiceId='', iiifContent='', manifest} = iiif

    if (!manifest && !iiifContent) {
      console.error(`[shortcodes:canvasPanel] Invalid params for figure "${id}": `, params)
      return ''
    }

    return html`
      <canvas-panel
        canvas-id="${canvas.id}"
        choice-id="${choiceId}"
        height="${height}"
        iiif-content="${iiifContent}"
        manifest-id="${manifest.id}"
        preset="${preset}"
        region="${region}"
        virtual-sizes="${virtualSizes}"
        width="${width}"
      />
    `
  }
}
