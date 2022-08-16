const { globalVault } = require('@iiif/vault')
const chalkFactory = require('~lib/chalk')
const path = require('path')
const vault = globalVault()
const getChoices = require('./get-choices')
const isCanvas = require('./is-canvas')

const { info, warn } = chalkFactory('getIIIFProperties')

/**
 * Returns a figure's manifest, canvas, choices, and annotations data from vault
 * 
 * @param  {Object} figure
 * @return {Object}
 * @property {Object} canvas Response from vault.get(canvasId). Defaults to first canvas in manifest.
 * @property {String} choiceId The default choice (if canvas has choices)
 * @property {Array} choices Array of responses from vault.get(choiceId)
 * @property {Object} manifest Response from vault.load(manifestId)
 */
module.exports = async function (eleventyConfig, figure, options={}) {
  const { config, env, iiifManifests } = eleventyConfig.globalData
  const { id, canvasId, manifestId } = figure
  let annotations, choices, manifest

  if (!isCanvas(figure)) return

  switch(true) {
    /**
     * External manifest
     */
    case !!manifestId:
      manifest = await vault.loadManifest(manifestId)
      canvas = vault.get(canvasId || manifest.items[0].id)
      break
    /**
     * Quire-generated manifest
     */
    case !!id && !!iiifManifests:
      const json = iiifManifests[id]
      if (!json) {
        warn(`Failed to look up IIIF manifest in global data. Fig.id: ${id}`)
        return
      }
      manifest = await vault.load(json.id, json)
      canvas = vault.get(manifest.items[0].id)
      break
    default:
      warn(`Figure missing params canvasId or manifestId, or choices. Fig.id: ${id}`)
      break
  }

  if (!canvas) {
    console.warn(`[iiif:helpers:getIIIFProperties] Error getting canvas for figure manifest. Fig.id: ${id}`)
    return
  }

  choices = getChoices(canvas.annotations)
  if (!choices.length && canvas.items.length) {
    canvas.items.map(({ id, type }) => {
      if (type === 'AnnotationPage') {
        const annotationPage = vault.get(id)
        choices = getChoices(annotationPage.items)
      }
    })
  }

  choiceId = figure.choiceId || choices.length && choices[0].id

  return {
    annotations,
    canvas,
    choices,
    choiceId,
    manifest
  }
}
