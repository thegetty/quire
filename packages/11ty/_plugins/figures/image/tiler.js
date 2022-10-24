const chalkFactory = require('~lib/chalk')
const fs = require('fs-extra')
const path = require('path')
const sharp = require('sharp')

const logger = chalkFactory('Figures:ImageTiler', 'DEBUG')

/**
 * Tiler
 *
 * @class  Tiler
 */
module.exports = class Tiler {
  /**
   * @param  {Object} iiifConfig 
   */
  constructor(iiifConfig) {
    this.baseURI = iiifConfig.baseURI
    this.formats = iiifConfig.formats
    this.outputRoot = iiifConfig.dirs.outputRoot
    this.supportedExtensions = iiifConfig.formats.flatMap(({ input }) => input)
    this.tilesDir = iiifConfig.tilesDirName
    this.tileSize = iiifConfig.tileSize
  }

  /**
   * Tile an image for IIIF image service using sharp
   * @param  {String} inputPath   Path to the image file to tile
   * @param  {Object}
   */
  async tile(inputPath, outputDir) {
    if (!inputPath) return

    const { ext, name } = path.parse(inputPath)

    if (!this.supportedExtensions.includes(ext)) {
      return {
        errors: [`Image file of type '${ext}' is not supported. Supported file types are: ${this.supportedExtensions.join(', ')}`]
      }
    }

    const outputPath = path.join(this.outputRoot, outputDir, name, this.tilesDir)

    if (fs.existsSync(path.join(outputPath, 'info.json'))) {
      logger.debug(`skipping previously tiled image '${inputPath}'`)
      return { success: true }
    }

    fs.ensureDirSync(outputPath)

    try {
      logger.debug(`tiling '${inputPath}'`)
      const format = this.formats.find(({ input }) => input.includes(ext))
      const response = await sharp(inputPath)
        .toFormat(format.output.replace('.', ''))
        .tile({
          id: new URL(path.join(outputDir, name), this.baseURI).toString(),
          layout: 'iiif',
          size: tileSize
        })
        .toFile(path.join(outputPath))
      return { success: true }
    } catch (error) {
      return { errors: [error] }
    }
  }
}
