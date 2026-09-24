import Compositor from './compositor.js'
import Tiler from './tiler.js'
import Transformer from './transformer.js'
import chalkFactory from '#lib/chalk/index.js'
import fs from 'fs-extra'
import path from 'node:path'

const logger = chalkFactory('Figures:ImageProcessor', 'DEBUG')

/**
 * The Image Processor organizes image manipulations:
 *   - Composites images into grids or overlays
 *   - Creating resized image derivatives using the configuration's `transformations` object
 *   - Tiling zoomable images for the IIIF Image API
 *   - Copies images into output directory so it's not removed by Vite
 *
 * Manipulations are invoked using the `processImages` method.
 *
 */
export default class ImageProcessor {
  #composite

  /**
   * @function constructor
   *
   * @param {Object} iiifConfig
   *
   * @returns {ImageProcessor}
   *
   **/
  constructor (iiifConfig) {
    const { debugLog, imagesDir, inputRoot, outputRoot } = iiifConfig.dirs

    const compositor = new Compositor(iiifConfig)
    const tiler = new Tiler(iiifConfig)
    const transformer = new Transformer(iiifConfig)

    this.#composite = compositor.composite.bind(compositor)
    this.inputRoot = path.join(inputRoot, imagesDir)
    this.debugLog = debugLog
    this.outputRoot = outputRoot
    this.tile = tiler.tile.bind(tiler)
    this.transform = transformer.transform.bind(transformer)

    if (this.debugLog) {
      logger.debug(`
        inputRoot: ${this.inputRoot}
        outputRoot: ${this.outputRoot}
      `)
    }
  }

  /**
   * @function processImages
   *
   * @param  {Array<String>} imagePaths Images to process
   * @param  {String} destinationDir Subdirectory for resulting files
   * @param  {Object} options
   * @property  {string|undefined} composite Whether to generate a composite and which mode to use ('grid'|'overlay')
   * @property  {Boolean} iiifEndpoint Whether to handle input as an IIIF endpoint
   * @property  {Boolean} tile Whether to generate image tiles
   * @property  {Object} transformations `sharp` resize configurations to use on this image
   *
   * @returns {Object}
   * @property {Array} errors Process error messages
   * @property {Object} metadata Dimensions and other metadata about processed images
   *
   * Performs image manipulations on `imagePaths` according to `options`.
   * Image outputs are placed at `destinationDir` in the configured `outputDir`.
   *
   */
  async processImages (imagePaths, destinationDir, options = {}) {
    const { composite, iiifEndpoint, tile, transformations } = options

    if (imagePaths.length === 0) {
      logger.error('processImages must be called with at least one argument')
      return {}
    }

    if (composite && composite !== 'grid' && composite !== 'overlay') {
      logger.error('processImages must be called with composite of "grid" or "overlay"')
      return {}
    }

    const errors = []
    const metadata = {}

    if (composite) {
      try {
        const filepath = path.posix.join(destinationDir, 'composite.jpg')
        const result = await this.#composite(imagePaths, composite, filepath)

        metadata['print-image'] = result
      } catch (error) {
        errors.push(`Failed to composite images ${imagePaths} ${error}`)
      }
    }

    const imagePath = imagePaths.at(0)
    if (imagePath.startsWith('http') && !options.iiifEndpoint) {
      if (this.debugLog) logger.debug(`processing skipped for '${imagePath}'`)
      return {}
    }

    const inputPath = iiifEndpoint ? imagePath : path.join(this.inputRoot, imagePath)

    if (this.debugLog) logger.debug(`processing inputPath: ${inputPath}`)

    if (transformations) {
      /**
       * Transform Image
       */
      for (const transformation of options.transformations) {
        const { name } = transformation

        try {
          const result = await this.transform(inputPath, destinationDir, transformation, options)

          metadata[name] = { ...result }
        } catch (error) {
          errors.push(`Failed to transform source image ${imagePath} ${error}`)
        }
      }
    }

    if (tile) {
      /**
       * Tile image
       */
      try {
        await this.tile(inputPath, destinationDir, options)
      } catch (error) {
        errors.push(`Failed to generate tiles from source ${imagePath} ${error}`)
      }
    }

    // NB: Early exit here avoids copy routine
    // TODO: The issue is that imagePath is coming in as absolute where other paths are relative to inputRoot
    if (composite) return { errors, metadata }

    /**
     * Copy full file for use by downstream components
     */
    const { base } = path.parse(imagePath)
    try {
      fs.copySync(inputPath, path.join(this.outputRoot, destinationDir, base))
    } catch (error) {
      errors.push(`Failed to copy source image ${imagePath} ${error}`)
    }

    return { errors, metadata }
  }
}
