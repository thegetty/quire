const chalkFactory = require('~lib/chalk')
const getAnnotations = require('./get-annotations')
const isCanvas = require('./is-canvas')
const path = require('path')
const { globalVault } = require('@iiif/vault')

const vault = globalVault()
const { info, warn } = chalkFactory('getIIIFProperties')

/**
 * Returns a figure's manifest and canvas data from vault
 * 
 * @param  {Object} figure
 * @return {Object}
 * @property {Object} canvas Response from vault.get(canvasId). Defaults to first canvas in manifest.
 * @property {Array} annotations Array of annotation items with added iiifId property
 * @property {Object} manifest Response from vault.load(manifestId)
 */
module.exports = async function (eleventyConfig, figure, options={}) {
  const { config, env, iiifConfig, iiifManifests } = eleventyConfig.globalData
  const { id, canvasId, manifestId } = figure
  let manifest

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

  const annotations = getAnnotations(iiifConfig, figure, canvas)

  return { canvas, annotations, manifest }
}
