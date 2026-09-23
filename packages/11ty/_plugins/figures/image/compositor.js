import chalkFactory from '#lib/chalk/index.js'
import sharp from 'sharp'

const logger = chalkFactory('Figures:ImageTiler', 'DEBUG')

const DEFAULT_COMPOSITE_HEIGHT = 1000
const DEFAULT_COMPOSITE_WIDTH = 1200
const DEFAULT_COMPOSITE_TILE_WIDTH = 400
/**
 * Compositor
 *
 * @class  Compositor
 */
export default class Compositor {
  constructor (iiifConfig) {
    this.iiifConfig = iiifConfig
  }

  /**
   * @function createCompositeGrid
   * 
   * @param {Array<Object>} images
   * @param {string} outputPath
   * 
   * Composites contents of `images` into a gridded array and returns it
   * 
   **/ 
  async createCompositeGrid (images, outputPath) {
    const canvas = sharp({
      height: DEFAULT_COMPOSITE_HEIGHT,
      width: DEFAULT_COMPOSITE_WIDTH
    })

    // Create layers from each resized image
    let layers = []
    for (const image of images) {
      const buffer = await sharp(image.src).resize(DEFAULT_COMPOSITE_TILE_WIDTH).toBuffer()

      // TODO: determine x, y

      return {
        input: buffer
      }      
    }

    canvas.composite(layers)

    // TODO: Errors?
    await canvas.toFile(outputPath)
  }

  /**
   * @function createCompositeGrid
   * 
   * @param {Array<Object>} images
   * @param {string} outputPath
   * 
   * Overlays contents of `images` into one image
   * 
   **/ 
  async createCompositeOverlay (images, outputPath) {
    // Create a canvas, configure layers for overlay
    const base = images.at(0)
    const { height, width } = sharp(base.src).metadata()

    const canvas = sharp({
      height,
      width
    })

    // Create layer configurations for each image and perform the composite
    const layers = images.map((annotation) => {
      return {
        input: annotation.src
      }
    })
    canvas.composite(layers)

    // TODO: Errors?
    await canvas.toFile(outputPath)
  }

  /**
   * @function composite
   * 
   * @param {Array} images
   * @param {string} mode
   * @param {string} outputPath
   * 
   * @returns {Object} dimensions of composited image
   * 
   * Composites `images` into an image according to `mode`,
   * writing to `outputPath`.
   * 
   **/ 
  async composite (images, mode, outputPath) {
    switch (mode) {
      case 'overlay':
        return this.createCompositeOverlay(images, outputPath)
      case 'grid':
        return this.createCompositeGrid(images, outputPath)
    }
  }
}