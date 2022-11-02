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
   * @param  {String} inputPath   Path to the image file to tile
   * @param  {Object}
   */
  async tile(inputPath, outputDir) {
    if (!inputPath) return
    const { ext, name } = path.parse(inputPath)

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
    const tileDirectory = path.join(outputDir, name, dirs.imageService)

    if (fs.existsSync(path.join(dirs.outputRoot, tileDirectory, 'info.json'))) {
      logger.info(`Skipping previously tiled image "${inputPath}"`)
      return { success: true }
    }
    fs.ensureDirSync(path.join(dirs.outputRoot, tileDirectory))

    try {
      logger.info(`Tiling image: "${inputPath}"`)
      const response = await sharp(inputPath)
        .toFormat(format.output.replace('.', ''))
        .tile({
          id: new URL(path.join(outputDir, name), baseURL).href,
          layout: 'iiif',
          size: tileSize
        })
        .toFile(path.join(dirs.outputRoot, tileDirectory))
      return { success: true }
    } catch(error) {
      return { errors: [error] }
    }
  }
}
