const { html } = require('common-tags')
// const vault = require('@iiif/vault')

/**
 * A shortcode that renders the canvas-panel web component
 */
module.exports = function(eleventyConfig, globalData) {

  return function(params) {
    const { figure } = params
    const { canvasId, manifestId, preset } = figure

    // @todo get choices from vault
    // const manifest = vault.get(manifestId)

    return html`
      <canvas-panel id="gradoo" canvas-id="${canvasId}" manifest-id="${manifestId}" preset="${preset}"></canvas-panel>
    `
  }
}
