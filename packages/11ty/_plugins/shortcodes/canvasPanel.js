/**
 * CanvasPanel shortcode that renders the digirati <canvas-panel> web component
 * @see {@link https://iiif-canvas-panel.netlify.app/docs/intro/ Canvas Panel Documentation}
 */
const { globalVault } = require('@iiif/vault')
const { html } = require('common-tags')
const path = require('path')

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
  const { config, env, iiifConfig, iiifManifests } = eleventyConfig.globalData
  const { imageDir } = config.params

  const getDefaultChoiceFromFigure = (choices) => {
    if (!choices) return
    const choice = choices.find(({ default: defaultChoice }) => !!defaultChoice) || choices[0]
    const { name, ext } = path.parse(choice.src)
    return new URL([imageDir, choice.src].join('/'), env.URL).href
  }

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
    let { canvasId, id, iiifContent, manifestId, preset, region, width } = params
    const choiceId = params.choiceId ? params.choiceId : getDefaultChoiceFromFigure(params.choices)
    let manifest

    switch(true) {
      case !!manifestId && !!canvasId:
        manifest = await vault.loadManifest(manifestId)
        break;
      case !!id && !!iiifManifests:
        const json = iiifManifests[id]
        if (!json) {
          console.warn('[shortcodes:canvasPanel] IIIF manifest not found for figure id: ', id)
        }
        manifestId = json.id
        manifest = await vault.load(manifestId, json)
        canvasId = manifest.items[0].id
        break;
      default:
        console.warn(`Error in CanvasPanel shortcode: Missing params canvasId or manifestId. Fig.id: `, id)
        return;
    }
    
    if (!manifest && !iiifContent) {
      console.error('[shortcodes:canvasPanel] Error fetching manifestId: ', manifestId)
    }

    const canvas = vault.get(canvasId)
    if (!canvas && !iiifContent) {
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
      if (item.id === choiceId) classes.push('canvas-choice--active')
      return `
        <button class="${classes.join(' ')}" type="button" value="${item.id}">
          ${item.label.en ? item.label.en[0] : item.label}
        </button>
      `
    })

    return html`
      <canvas-panel
        id="${id}"
        iiif-content="${iiifContent}"
        canvas-id="${canvasId}"
        choice-id="${choiceId}"
        manifest-id="${manifestId}"
        preset="${preset}"
        region="${region}"
        width="${width}"
      />
      ${hasChoices ? choicesUI.join('') : ''}
    `
  }
}
