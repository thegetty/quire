const chalkFactory = require('~lib/chalk')
const fs = require('fs-extra')
const path = require('path')
const Tiler = require('./tiler')
const Transformer = require('./transformer')

const logger = chalkFactory('Figures:ImageProcessor', 'DEBUG')

/**
 * The Quire Image Processor handles file system changes for IIIF images
 * - Create image transformations
 * - Tiles images OR copies image into output directory so it's not removed by Vite
 * 
 * @return {Object}
 * @property {Array} errors Process error messages
 */
module.exports = class ImageProcessor {
  constructor(iiifConfig) {
    const { imagesDir, inputRoot, outputRoot } = iiifConfig.dirs
    const tiler = new Tiler(iiifConfig)
    const transformer = new Transformer(iiifConfig)

    this.inputRoot = path.join(inputRoot, imagesDir)
    this.outputRoot = outputRoot
    this.tiler = tiler.tile.bind(tiler)
    this.transform = transformer.transform.bind(transformer)

    logger.debug(`
      inputRoot: ${this.inputRoot}
      outputRoot: ${this.outputRoot}
    `)
  }

  /**
   * @param  {String} imagePath
   * @param  {String} outputPath
   * @param  {Object} options
   * @property  {Boolean} tile To tile or not to tile
   * @property  {Object} transformations Image transformations to perform
   */
  async processImage(imagePath, outputPath, options = {}) {
    if (!imagePath || imagePath.startsWith('http')) {
      logger.debug(`processing skipped for '${imagePath}'`)
      return {}
    }

    const errors = []
    const inputPath = path.join(this.inputRoot, imagePath)

    logger.debug(`processing inputPath: ${inputPath}`)

    if (options.transformations) {
      /**
       * Transform Image
       */
      await Promise.all(
        options.transformations.map((transformation) => {
          return this.transform(inputPath, outputPath, transformation, options)
        })
      ).catch((error) => {
        errors.push(`Failed to transform source image ${imagePath} ${error}`)
      })
    }

    if (options.tile) {
      /**
       * Tile image
       */
      try {
        await this.tiler(inputPath, outputPath)
      } catch(error) {
        errors.push(`Failed to generate tiles from source ${imagePath} ${error}`)
      }
    } else {
      /**
       * Copy file to output directory since vite removes images
       * not directly referenced by the templates
       */
      const { base } = path.parse(imagePath)
      try {
        fs.copySync(inputPath, path.join(this.outputRoot, outputPath, base))
      } catch(error) {
        errors.push(`Failed to copy source image ${imagePath} ${error}`)
      }
    }

    return { errors }
  }
} 
