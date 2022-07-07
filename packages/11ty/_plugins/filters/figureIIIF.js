const { globalVault } = require('@iiif/vault')
const chalkFactory = require('~lib/chalk')
const path = require('path')
const vault = globalVault()

const { info, warn } = chalkFactory('filters:figureIIIF')

/**
 * Returns a figure's IIIF properties
 * @param  {Object} figure
 * @return {Object}
 * @property {Object} canvas Response from vault.get(canvasId). Defaults to first canvas in manifest.
 * @property {String} choiceId The default choice (if canvas has choices)
 * @property {Array} choices Array of responses from vault.get(choiceId)
 * @property {Object} manifest Response from vault.load(manifestId)
 */
module.exports = async function (eleventyConfig, figure, options={}) {
  const { config, env, iiifManifests } = eleventyConfig.globalData
  const { id, iiifContent, manifestId } = figure
  let canvasId, choiceId, choices, manifest

  /**
   * Very simplified method to get choices - expects a valid manifest where choices all have identifiers
   * @todo replace with vault helper
   */
  const getChoices = (annotations = []) => {
    return annotations.flatMap(({ id, type }) => {
      const annotation = vault.get(id);
      if (annotation.motivation.includes('painting')) {
        const bodies = vault.get(annotation.body);
        for (const body of bodies) {
          const { items, type } = body;
          return type === 'Choice' ? items.map(({ id }) => vault.get(id)) : [];
        }
      }
    });
  };

  const getDefaultChoiceFromFigure = (choices) => {
    if (!choices) return
    const choice = choices.find(({ default: defaultChoice }) => !!defaultChoice) || choices[0]
    const { name, ext } = path.parse(choice.src)
    return new URL([config.params.imageDir, choice.src].join('/'), env.URL).href
  }

  switch(true) {
    /**
     * External manifest
     */
    case !!manifestId:
      canvasId = figure.canvasId
      manifest = await vault.loadManifest(manifestId)
      canvas = vault.get(manifest.items[0].id)
      break;
    /**
     * Quire-generated manifest
     */
    case !!id && !!iiifManifests:
      const json = iiifManifests[id]
      if (!json) {
        warn('Failed to look up IIIF manifest in global data. Fig.id: ', id)
        return
      }
      manifest = await vault.load(json.id, json)
      canvas = vault.get(manifest.items[0].id)
      choiceId = getDefaultChoiceFromFigure(figure.choices)
      choices = getChoices(canvas.annotations);
      if (!choices.length && canvas.items.length) {
        canvas.items.map(({ id, type }) => {
          if (type === 'AnnotationPage') {
            const annotationPage = vault.get(id);
            choices = getChoices(annotationPage.items);
          }
        });
      }
      break;
    default:
      warn(`Figure missing params canvasId or manifestId, or choices. Fig.id: `, id)
      break;
  }

  if (!canvas) {
    console.warn(`[filters:figureIIIF] Error getting canvas for figure manifest. Fig.id: `, id)
    return
  }

  return {
    canvas,
    choiceId,
    choices,
    iiifContent,
    manifest
  }
}
