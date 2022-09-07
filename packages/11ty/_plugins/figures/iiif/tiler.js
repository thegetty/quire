const chalkFactory = require('~lib/chalk')
const fs = require('fs-extra')
const path = require('path')
const sharp = require('sharp')
const logger = chalkFactory('Figure Processing:IIIF:Tile Image')


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
    const id = new URL(path.join(outputDir, name), baseURL).href
    const info = [id, imageServiceDirectory, 'info.json'].join('/')

    if (fs.existsSync(outputFile)) {
      logger.info(`Skipping previously tiled image "${inputPath}"`)
      return { info }
    }

    fs.ensureDirSync(outputPath)

    try {
      logger.info(`Tiling image: "${inputPath}"`)
      const response = await sharp(inputPath)
        .toFormat(format.output.replace('.', ''))
        .tile({
          id,
          layout: 'iiif',
          size: tileSize
        })
        .toFile(outputPath)
      logger.info(`Done tiling image "${inputPath}"`)
      return { info }
    } catch(error) {
      return { errors: [error] }
    }
  }
}
