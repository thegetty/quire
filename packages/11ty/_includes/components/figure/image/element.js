/**
 * A shortcode for displaying an image
 *
 * @param      {Object} figure  The figure object
 *
 * @return     {String}  An HTML <img> element, `<canvas-panel>` or `<image-service>` web components
 */
module.exports = function (eleventyConfig) {
  const canvasPanel = eleventyConfig.getFilter('canvasPanel')
  const imageService = eleventyConfig.getFilter('imageService')
  const imageTag = eleventyConfig.getFilter('imageTag')
  const { imageDir } = eleventyConfig.globalData.config.params

  return function (figure) {
    const { isCanvas, isImageService } = figure

    switch (true) {
      case isCanvas:
        return canvasPanel(figure)
      case isImageService:
        return imageService(figure)
      default:
        return imageTag(figure)
    }
  }
}
