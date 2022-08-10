const { html } = require('~lib/common-tags')
const chalkFactory = require('~lib/chalk')

/**
 * Render the Digirati <canvas-panel> web componnent
 * @see {@link https://iiif-canvas-panel.netlify.app/docs/intro/ Canvas Panel Documentation}
 *
 * @param  {Object} params `figure` data from `figures.yaml`
 * @property  {String} canvasId The id of the canvas to render
 * @property  {String} choiceId The id of the choice to use as default (optional, and only applicable to canvases with choices)
 * @property  {String} id The id property of the figure in figures.yaml
 * @property  {String} manifestId The id of the manifest to render
 * @property  {String} preset <canvas-panel> preset {@link https://iiif-canvas-panel.netlify.app/docs/examples/responsive-image#presets}
 * @return {String}        <canvas-panel> markup
 */
module.exports = function (figure) {
  const {
    height='',
    id,
    iiif,
    preset='responsive',
    region='',
    virtualSizes='',
    width=''
  } = figure

  const { error } = chalkFactory('shortcodes:canvasPanel')

  const { canvas, choiceId='', iiifContent='', manifest} = iiif

  if (!manifest && !iiifContent) {
    error(`Invalid params for figure "${id}": `, params)
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
