const AnnotationSet = require('./annotation-set')

module.exports = class Canvas {
  constructor({ eleventyConfig, figure }) {
    const { outputDir } = eleventyConfig.globalData.iiifConfig
    const iiifId = [process.env.URL, outputDir, id].join("/")

    this.config = eleventyConfig.globalData.iiifConfig
    this.figure = figure
    this.id = [iiifId, 'canvas'].join('/')
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
    const fullImagePath = path.join(this.config.inputDir, this.imagePath)
    return await sharp(fullImagePath).metadata()
  }
}
