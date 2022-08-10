const { globalVault } = require('@iiif/vault')
const path = require('path')
const vault = globalVault()
const { isCanvas, isImageService } = require('../helpers')

/**
 * Fetches IIIF data needed to render canvas panel tags from vault and adds it to figures.yaml
 * @param  {Object} eleventyConfig
 */
module.exports = async (eleventyConfig) => {
  const figureIIIF = eleventyConfig.getFilter('figureIIIF')
  const { figures, iiifConfig } = eleventyConfig.globalData
  const { imageServiceDirectory, outputDir } = iiifConfig

  for (const [index, figure] of figures.figure_list.entries()) {
    switch (true) {
      case isImageService(figure):
        const { name, ext } = path.parse(figure.src)
        const baseURL = path.join('/', outputDir, name)
        const info = figure.src.startsWith('http')
          ? figure.src
          : path.join(baseURL, imageServiceDirectory, 'info.json')
        Object.assign(eleventyConfig.globalData.figures.figure_list[index], {
          printImage: figure.printImage || path.join(baseURL, `print-image${ext}`),
          iiif: {
            info
          },
          isImageService: true
        })
        break
      case isCanvas(figure):
        const { canvas, choiceId, choices, iiifContent, manifest } = await figureIIIF(figure)
        Object.assign(eleventyConfig.globalData.figures.figure_list[index], {
          iiif: {
            choices,
            canvas,
            choiceId,
            iiifContent,
            manifest
          },
          isCanvas: true
        })
        break
      default:
        break
    }
  }
}
