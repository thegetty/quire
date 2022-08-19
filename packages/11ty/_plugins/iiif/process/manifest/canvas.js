const path = require('path')
const sharp = require('sharp')
const Base = require('./base')

module.exports = class Canvas extends Base{
  constructor(data) {
    super(data)

    this.id = [this.baseId, 'canvas'].join('/')
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
    return await sharp(fullImagePath).metadata()
  }
}
