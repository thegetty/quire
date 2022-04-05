const { html } = require('common-tags')
const { globalVault } = require('@iiif/vault')

const vault = globalVault()
/**
 * A shortcode that renders the canvas-panel web component
 */

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
module.exports = function(eleventyConfig, globalData) {

  return async function(params) {
    let { canvasId, id, manifestId, preset } = params

    if (!manifestId || !canvasId) {
      console.warn(`Error in CanvasPanel shortode: Missing params canvasId or manifestId. Fig.id: `, id)
      return;
    }

    let choices

    await vault.loadManifest(manifestId)
    const canvas = vault.get(canvasId)
    choices = getChoices(canvas.annotations)
    if (!choices.length && canvas.items.length) {
      canvas.items.map(({ id, type }) => {
        if (type === 'AnnotationPage') {
          const annotationPage = vault.get(id)
          choices = getChoices(annotationPage.items)
        }
      })
    }

    // console.warn('choices', choices)
    const hasChoices = !!choices.length

    choicesUI = choices.map((item, index) => {
      const classes = ['canvas-choice']
      if (index === 0) classes.push('canvas-choice--active')
      return `<button class="${classes.join(' ')}" type="button" value="${item.id}">${item.label.en ? item.label.en[0] : item.label}</button>`
    })

    return html`
      <canvas-panel id="${id}" canvas-id="${canvasId}" manifest-id="${manifestId}" preset="${preset}">
        ${hasChoices ? choicesUI.join('') : ''}
      </canvas-panel>
    `
  }
}
