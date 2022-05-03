const path = require('path')
const { globalVault } = require('@iiif/vault')
const vault = globalVault()

/**
 * Returns a figure's IIIF properties
 * @param  {Object} figure
 * @return {Object}
 * @property {Object} canvas Response from vault.get(canvasId). Defaults to first canvas in manifest.
 * @property {Object} choiceId The default choice (if canvas has choices)
 * @property {Object} manifest Response from vault.load(manifestId)
 */

module.exports = async function (eleventyConfig, figure, options={}) {
  const { config, env, iiifManifests } = eleventyConfig.globalData
  let { choices, id, manifestId } = figure

  const getDefaultChoiceFromFigure = (choices) => {
    if (!choices) return
    const choice = choices.find(({ default: defaultChoice }) => !!defaultChoice) || choices[0]
    const { name, ext } = path.parse(choice.src)
    return new URL([config.params.imageDir, choice.src].join('/'), env.URL).href
  }

  let canvasId, choiceId, manifest
  switch(true) {
    case !!manifestId:
      canvasId = figure.canvasId
      manifest = await vault.loadManifest(manifestId)
      break;
    case !!id && !!iiifManifests:
      const json = iiifManifests[id]
      if (!json) {
        console.warn('[filters:figureIIIF] Failed to look up IIIF manifest in global data. Fig.id: ', id)
        return
      }
      manifestId = json.id
      manifest = await vault.load(manifestId, json)
      choiceId = getDefaultChoiceFromFigure(choices)
      break;
    default:
      console.warn(`[filters:figureIIIF] Figure missing params canvasId or manifestId, or choices. Fig.id: `, id)
      break;
  }

  canvasId = figure.canvasId || manifest.items[0].id

  const canvas = vault.get(canvasId)

  if (!canvas) {
    console.warn(`[filters:figureIIIF] Error getting canvas for figure manifest. Fig.id: `, id)
    return
  }
  return {
    canvas,
    choiceId,
    manifest
  }
}
