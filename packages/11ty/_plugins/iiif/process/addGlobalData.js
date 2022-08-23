const { globalVault } = require('@iiif/vault')
const vault = globalVault()
const { getImageService, getIIIFProperties, getPrintImage } = require('../helpers')

/**
 * Adds IIIF data from vault and computed properties to `eleventyConfig.globalData.figures`
 * 
 * Properties:
 * @property {Array} annotations Adds `iiifId` to figure.annotations
 * @property {Object} canvas Response from vault.get(canvasId)
 * @property {Array} choices IIIF annotations with type "choice"
 * @property {String} choiceId The default choice selected on load
 * @property {String} info Path to image service `info.json`
 * @property {Object} manifest Response from vault.get(manifestId)
 * 
 * @param  {Object} eleventyConfig
 */
module.exports = async (eleventyConfig) => {
  const { figures, iiifConfig } = eleventyConfig.globalData
  const { imageServiceDirectory, outputDir } = iiifConfig

  for (const [index, figure] of figures.figure_list.entries()) {
    const { annotations, canvas, manifest } = await getIIIFProperties(eleventyConfig, figure) || {}
    const info = getImageService(eleventyConfig, figure)
    Object.assign(eleventyConfig.globalData.figures.figure_list[index], {
      annotations,
      isCanvas: !!canvas,
      isImageService: !!info,
      iiif: {
        canvas,
        info,
        manifest
      },
      printImage: getPrintImage(eleventyConfig, figure)
    })
  }
}
