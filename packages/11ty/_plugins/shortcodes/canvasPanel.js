/**
 * CanvasPanel shortcode that renders the digirati <canvas-panel> web component
 * @see {@link https://iiif-canvas-panel.netlify.app/docs/intro/ Canvas Panel Documentation}
 */
const { globalVault } = require('@iiif/vault')
const { html } = require('common-tags')

const vault = globalVault()

/**
 * Very simplified method to get choices - expects a valid manifest where choices all have identifiers
 * @todo replace with vault helper
 */
const getChoices = (annotations=[]) => {
  return annotations.flatMap(({ id, type }) => {
    const annotation = vault.get(id)
    if (annotation.motivation.includes('painting')) {
      const bodies = vault.get(annotation.body)
      for (const body of bodies) {
        const { items, type } = body
        if (type === 'Choice') {
          return items.map(({ id }) => vault.get(id))
        }
      }
    }
  }).filter(item => item)
}

module.exports = function(eleventyConfig) {
  const { iiifConfig } = eleventyConfig.globalData

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
  return async function(params) {
    let { canvasId, choiceId, id, manifestId, preset } = params

    switch(true) {
      case !!manifestId && !!canvasId:
        break;
      case !!id:
        /**
         * @todo replace with directory defined in IIIF config
         */
        canvasId = new URL([iiifConfig.output, id, 'canvas'].join('/'), process.env.URL).href
        manifestId = new URL([iiifConfig.output, id, iiifConfig.manifestFilename].join('/'), process.env.URL).href
        break;
      default:
        console.warn(`Error in CanvasPanel shortcode: Missing params canvasId or manifestId. Fig.id: `, id)
        return;
    }
    
    const manifest = await vault.loadManifest(manifestId)
    if (!manifest) {
      console.error('[shortcodes:canvasPanel] Error fetching manifestId: ', manifestId)
    }

    const canvas = vault.get(canvasId)
    if (!canvas) {
      console.error('[shortcodes:canvasPanel] Error fetching canvasId: ', canvasId)
    }

    let choices = getChoices(canvas.annotations)
    if (!choices.length && canvas.items.length) {
      canvas.items.map(({ id, type }) => {
        if (type === 'AnnotationPage') {
          const annotationPage = vault.get(id)
          choices = getChoices(annotationPage.items)
        }
      })
    }

    const hasChoices = !!choices.length

    choicesUI = choices.map((item, index) => {
      const classes = ['canvas-choice']
      if (index === 0) classes.push('canvas-choice--active')
      return `
        <button class="${classes.join(' ')}" type="button" value="${item.id}">
          ${item.label.en ? item.label.en[0] : item.label}
        </button>
      `
    })

    return html`
      <canvas-panel
        id="${id}"
        canvas-id="${canvasId}"
        choice-id="${choiceId}"
        manifest-id="${manifestId}"
        preset="${preset}"
      />
      ${hasChoices ? choicesUI.join('') : ''}
    `
  }
}
