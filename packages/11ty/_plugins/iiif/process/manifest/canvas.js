const path = require('path')
const sharp = require('sharp')
const Base = require('./base')

module.exports = class Canvas extends Base {
  constructor(iifConfig, figure) {
    super(iifConfig)

    this.figure = figure
    this.id = [this.getBaseId(this.figure.id), 'canvas'].join('/')
  }

  /**
   * Use dimensions of figure.src or first choice as canvas dimensions
   */
  get imagePath() {
    const firstChoice = this.figure.annotations
      .flatMap(({ items }) => items)
      .find(({ target }) => !target)
    return this.figure.src || firstChoice.src
  }

  async getDimensions() {
    const fullImagePath = path.join(this.iiifConfig.inputDir, this.imagePath)
    const { height, width } = await sharp(fullImagePath).metadata()
    this.height = height
    this.width = width
    return { height, width }
  }
}
