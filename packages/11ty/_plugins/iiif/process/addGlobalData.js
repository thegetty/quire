const { globalVault } = require('@iiif/vault')
const vault = globalVault()
const { getImageService, getIIIFProperties, getPrintImage } = require('../helpers')

/**
 * Adds IIIF data from vault and computed properties to `eleventyConfig.globalData.figures`
 * 
 * Properties:
 * @property {Array} annotations IIIF annotations
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
    const iiif = await getIIIFProperties(eleventyConfig, figure) || {}
    Object.assign(eleventyConfig.globalData.figures.figure_list[index], {
      iiif: {
        ...iiif,
        info: getImageService(eleventyConfig, figure)
      },
      printImage: getPrintImage(eleventyConfig, figure)
    })
  }
}
