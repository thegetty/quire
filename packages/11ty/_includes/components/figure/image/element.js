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

  return function (figure, options) {

    const { alt, isCanvas, isImageService, isSequence, staticInlineFigureImage, lazyLoading } = figure
    const { interactive, preset } = options
    if (preset) {
      figure.preset = preset
    }

    switch (true) {
      case isSequence:
        if (!interactive && staticInlineFigureImage) {
          return imageTag({ alt, src: staticInlineFigureImage, isStatic: !interactive, lazyLoading })
        } else {
          return imageSequence(figure, options)
        }
      case isCanvas:
        if (!interactive && staticInlineFigureImage) {
          return imageTag({ alt, src: staticInlineFigureImage, isStatic: !interactive, lazyLoading })
        } else {
          return canvasPanel(figure)
        }
      case isImageService:
        if (!interactive && staticInlineFigureImage) {
          return imageTag({ alt, src: staticInlineFigureImage, isStatic: !interactive, lazyLoading })
        } else {
          return imageService(figure)
        }
      default:
        return imageTag(figure)
    }
  }
}
