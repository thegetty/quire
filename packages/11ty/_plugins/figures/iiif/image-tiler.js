const chalkFactory = require('~lib/chalk')
const fs = require('fs-extra')
const path = require('path')
const sharp = require('sharp')
const { info } = chalkFactory('Figure Processing:IIIF:Tile Image')


module.exports = class ImageTiler {
  /**
   * @param  {Object} eleventyConfig 
   * @param  {Object} figure         Figure instance
   */
  constructor(eleventyConfig, figure) {
    if (!figure.src) return

    const {
      baseURL,
      formats,
      imageServiceDirectory,
      inputDir,
      inputRoot,
      outputDir,
      outputRoot,
      tileSize
    } = eleventyConfig.globalData.iiifConfig

    const { ext, name } = path.parse(figure.src)

    this.ext = ext
    this.format = formats.find(({ input }) => input.includes(ext))
    this.inputPath = path.join(inputRoot, inputDir, figure.src)
    this.outputPath = path.join(outputRoot, outputDir, name, imageServiceDirectory)
    this.supportedImageExtensions = formats.flatMap(({ input }) => input)
    this.tileSize = tileSize
    this.url = new URL(path.join(outputDir, name, imageServiceDirectory, 'info.json'), baseURL).href
  }

  /**
   * Tile an image for IIIF image service using sharp
   * @param  {String} figure   Figure entry data from `figures.yaml`
   * @param  {Object} options
   */
  async tile() {
    if (!this.supportedImageExtensions.includes(this.ext)) {
      return {
        errors: [`Image file type is not supported. Supported extensions are: ${this.supportedImageExtensions.join(', ')}`,]
      }
    }

    fs.ensureDirSync(this.outputPath)

    try {
      info(`Tiling image: "${this.inputPath}"`)
      const response = await sharp(this.inputPath)
        .toFormat(this.format.output.replace('.', ''))
        .tile({
          id: this.url,
          layout: 'iiif',
          size: this.tileSize
        })
        .toFile(this.outputPath)
      info(`Done tiling image "${this.inputPath}"`)
      return {
        id: this.url,
        response
      }
    } catch(error) {
      return { errors: [error] }
    }
  }
}
