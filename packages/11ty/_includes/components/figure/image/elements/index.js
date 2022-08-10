const canvasPanel = require('./canvasPanel')
const choices = require('./choices')
const imageService = require('./imageService')
const imageTag = require('./imageTag')
const { hasCanvasPanelProps, isImageService } = require('./utils')

module.exports = function (figure, imageDir) {
  switch (true) {
    case hasCanvasPanelProps(figure):
      return `
        ${canvasPanel(figure)}
        ${choices(figure)}
      `
    case isImageService(figure):
      return imageService(figure)
    default:
      return imageTag(figure, imageDir)
  }
}
