const { html } = require('common-tags')
const { globalVault } = require('@iiif/vault')

/**
 * A shortcode that renders the canvas-panel web component
 */
module.exports = function(eleventyConfig, globalData) {

  return function(params) {
    const { figure } = params
    const { canvasId, manifestId, preset } = figure

    const vault = globalVault()

    // @todo get choices from vault
    console.warn('manifestId', manifestId)
    vault.loadManifest(manifestId).then((manifest) => {
      console.warn(manifest)
      // @todo build choices UI and add to returned HTML
    })

    return html`
      <canvas-panel id="gradoo" canvas-id="${canvasId}" manifest-id="${manifestId}" preset="${preset}"></canvas-panel>
    `
  }
}
