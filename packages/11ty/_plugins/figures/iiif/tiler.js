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
   * @param  {String} imagePath   Path to the image file to tile
   * @param  {Object}
   */
  async tile(imagePath, outputPath) {
    if (!imagePath) return
    const { ext, name } = path.parse(imagePath)

    if (!this.supportedImageExtensions.includes(ext)) {
      return {
        errors: [`Image file type is not supported. Supported extensions are: ${this.supportedImageExtensions.join(', ')}`,]
      }
    }

    const {
      baseURL,
      dirs,
      formats,
      tileSize
    } = this.iiifConfig

    const format = formats.find(({ input }) => input.includes(ext))
    const inputPath = path.join(dirs.inputRoot, dirs.input, imagePath)
    const tileDirectory = path.join(outputPath, name, dirs.imageService)
    const info = new URL(path.join(tileDirectory, 'info.json'), baseURL).href

    if (fs.existsSync(path.join(dirs.outputRoot, tileDirectory, 'info.json'))) {
      logger.info(`Skipping previously tiled image "${inputPath}"`)
      return { info }
    }
    fs.ensureDirSync(path.join(dirs.outputRoot, tileDirectory))

    try {
      logger.info(`Tiling image: "${inputPath}"`)
      const response = await sharp(inputPath)
        .toFormat(format.output.replace('.', ''))
        .tile({
          id: new URL(path.join(outputPath, name), baseURL).href,
          layout: 'iiif',
          size: tileSize
        })
        .toFile(path.join(dirs.outputRoot, tileDirectory))
      return { info }
    } catch(error) {
      return { errors: [error] }
    }
  }
}
