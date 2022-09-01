const path = require('path')
/**
 * Return the path to a figure's image to use in print
 * 
 * @param  {Object} iiifConfig
 * @param  {Object} figure
 * @return {String}            Path to figure's print image
 */
module.exports = (iiifConfig, figure) => {
  const { outputDir } = iiifConfig
  const { printImage, src } = figure

  let defaultImage
  /**
   * Default images currently only exist for quire-generated image services
   * Figures with canvases require a `printImage` is supplied by the user
   * @todo create default print images for canvases
   */
  if (figure.src) {
    const { ext, name } = path.parse(src)
    defaultImage = path.join(outputDir, name, `print-image${ext}`)
  }

  return printImage || defaultImage
}
