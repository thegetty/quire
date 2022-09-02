const chalkFactory = require('~lib/chalk')
const fs = require('fs-extra')
const path = require('path')
const sharp = require('sharp')
const { info } = chalkFactory('Figure Processing:IIIF:Tile Image')


module.exports = class Tiler {
  /**
   * @param  {Object} iiifConfig 
   */
  constructor(iiifConfig) {
    this.iiifConfig = iiifConfig
    this.supportedImageExtensions = iiifConfig.formats.flatMap(({ input }) => input)
  }

  /**
   * Tile an image for IIIF image service using sharp
   * @param  {String} figure   Figure entry data from `figures.yaml`
   * @param  {Object}
   */
  async tile(figure) {
    if (!figure.src) return
    const { ext, name } = path.parse(figure.src)

    if (!this.supportedImageExtensions.includes(ext)) {
      return {
        errors: [`Image file type is not supported. Supported extensions are: ${this.supportedImageExtensions.join(', ')}`,]
      }
    }

    const {
      baseURL,
      formats,
      imageServiceDirectory,
      inputDir,
      inputRoot,
      outputDir,
      outputRoot,
      tileSize
    } = this.iiifConfig

    const outputFile = path.join(outputRoot, outputDir, name, imageServiceDirectory, 'info.json')
    const format = formats.find(({ input }) => input.includes(ext))
    const inputPath = path.join(inputRoot, inputDir, figure.src)
    const outputPath = path.join(outputRoot, outputDir, name, imageServiceDirectory)
    const url = new URL(path.join(outputDir, name, imageServiceDirectory, 'info.json'), baseURL).href

    if (fs.existsSync(outputFile)) {
      info(`Skipping previously tiled image "${inputPath}"`)
      return { info: url }
    }

    fs.ensureDirSync(outputPath)

    try {
      info(`Tiling image: "${inputPath}"`)
      const response = await sharp(inputPath)
        .toFormat(format.output.replace('.', ''))
        .tile({
          id: url,
          layout: 'iiif',
          size: tileSize
        })
        .toFile(outputPath)
      info(`Done tiling image "${inputPath}"`)
      return { info: url }
    } catch(error) {
      return { errors: [error] }
    }
  }
}
