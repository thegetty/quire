module.exports = function (eleventyConfig) {
  const canvasPanel = eleventyConfig.getFilter('canvasPanel')
  const imageService = eleventyConfig.getFilter('imageService')
  const imageTag = eleventyConfig.getFilter('imageTag')
  const { imageDir } = eleventyConfig.globalData.config.params

  return function (params) {
    const { isCanvas, isImageService } = params

    switch (true) {
      case isCanvas:
        return canvasPanel(params)
      case isImageService:
        return imageService(params)
      default:
        return imageTag(params, imageDir)
    }
  }
}
