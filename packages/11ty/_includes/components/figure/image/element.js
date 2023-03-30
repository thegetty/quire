/**
 * Renders an image
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  figure          The figure object
 *
 * @return     {String}  An HTML <img> element, `<canvas-panel>` or `<image-service>` web components
 */
module.exports = function (eleventyConfig) {
  const canvasPanel = eleventyConfig.getFilter('canvasPanel')
  const imageService = eleventyConfig.getFilter('imageService')
  const imageSequence = eleventyConfig.getFilter('figureImageSequence')
  const imageTag = eleventyConfig.getFilter('imageTag')
  const { imageDir } = eleventyConfig.globalData.config.figures

  return async function (figure, options) {
    const { isCanvas, isImageService, isSequence } = figure
    const { preset } = options
    if (preset) {
      figure.preset = preset
    }

    switch (true) {
      case isSequence:
        return await imageSequence(figure, options)
      case isCanvas:
        return canvasPanel(figure)
      case isImageService:
        return imageService(figure)
      default:
        return imageTag(figure)
    }
  }
}
