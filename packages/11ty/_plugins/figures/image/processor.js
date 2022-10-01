const fs = require('fs-extra')
const path = require('path')
const Tiler = require('./tiler')
const Transformer = require('./transformer')

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
    const { input, inputRoot, outputRoot } = iiifConfig.dirs
    this.inputDir = path.join(inputRoot, input)
    this.outputRoot = outputRoot
    this.tiler = new Tiler(iiifConfig)
    this.transformer = new Transformer(iiifConfig)
  }

  /**
   * @param  {String} imagePath
   * @param  {String} outputPath
   * @param  {Object} options
   * @property  {Boolean} tile To tile or not to tile
   * @property  {Object} transformations Image transformations to perform
   */
  async processImage(imagePath, outputPath, options = {}) {
    if (!imagePath || imagePath.startsWith('http')) return {}
    const errors = []
    const inputPath = path.join(this.inputDir, imagePath)

    if (options.transformations) {
      /**
       * Transform Image
       */
      const transformationResponses = await Promise.all(
        options.transformations.map((transformation) => {
          return this.transformer.transform(inputPath, outputPath, transformation, options)
        })
      )
      const transformationErrors = transformationResponses.flatMap(
        ({ errors }) => errors || []
      )
      if (transformationErrors.length) {
        errors.push(
          `Failed to transform image "${imagePath}". ${transformationErrors.join(" ")}`,
        );
      }
    }

    if (options.tile) {
      /**
       * Tile image
       */
      try {
        await this.tiler.tile(inputPath, outputPath)
      } catch(error) {
        errors.push(`Failed to tile image "${imagePath}". ${error}`) 
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
        errors.push(`Failed to copy image "${imagePath}". ${error}`)
      }
    }

    return { errors }
  }
} 
