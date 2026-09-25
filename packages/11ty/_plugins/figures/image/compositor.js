import chalkFactory from '#lib/chalk/index.js'
import fs from 'fs-extra'
import path from 'node:path'
import sharp from 'sharp'

const logger = chalkFactory('Figures:ImageTiler', 'DEBUG')

/**
 * @class Layout
 *
 * Class for laying out a grid of images according to their sizes
 *
 **/
class Layout {
  /**
   * @property dimensions {Array<Object<string,Number>>}
   * @private
   *
   * Array of dimensions objects with height, width keys
   **/
  #dimensions

  /**
   * @property #config
   * @private
   *
   * Configuration with overall image width, (top|bottom|left|right) margins, and the limit size for grid items
   **/
  #config

  /**
   * @property #coordinates
   * @private
   *
   * Array of coordinates for gridding images
   **/
  #coordinates

  /**
   * @function #scaleFittingLargest
   * @private
   *
   * @param {Number} height
   * @param {Number} width
   *
   * @returns {Object} `height` and `width` scaled so that the longest dimension fits the item size
   * @property {Number} height
   * @property {Number} width
   *
   **/
  #scaleFittingLargest (height, width) {
    const { itemTileSize } = this.#config
    const result = { height: 0, width: 0 }
    if (width >= height) {
      const scale = itemTileSize / width

      result.height = Math.ceil(height * scale)
      result.width = itemTileSize
    } else {
      const scale = itemTileSize / height

      result.height = itemTileSize
      result.width = Math.ceil(width * scale)
    }

    return result
  }

  /**
   * @function #doLayout
   * @private
   *
   * Performs the layout across `dimensions` by iteratively fitting rows.
   *
   * The simple algorithm:
   *   - Scale image so its longest side is itemTileSize long / tall.
   *   - Place the image:
   *      - If this is the first image, place it at the inset of top and left margins.
   *      - If the image will make this row of images larger than `maxImageWidth`, place it in a new row
   *
   **/
  #doLayout () {
    const {
      itemGap,
      itemTileSize,
      leftMargin,
      rightMargin,
      width: maxImageWidth
    } = this.#config

    // Determine the x,y for the first image
    let x = leftMargin
    let y = rightMargin

    // Scale the largest side to the item size and calculate the other dimension
    const { height: firstHeight, width: firstWidth } = this.#dimensions[0]

    const { height, width } = this.#scaleFittingLargest(firstHeight, firstWidth)

    const coordinates = [{ height, x, y, width }]

    // Iterate the remaining items and scale them similarly
    for (let i = 1; i < this.#dimensions.length; i++) {
      const { height: firstHeight, width: firstWidth } = this.#dimensions[i]

      // Calculate the rescaled height, width
      const { height, width } = this.#scaleFittingLargest(firstHeight, firstWidth)

      switch (true) {
        case (x + itemTileSize + rightMargin > maxImageWidth):
          x = leftMargin
          y += itemTileSize + itemGap
          break

        default:
          x += itemTileSize + itemGap
          break
      }

      // Offset the calculated y and x so the image is centered in its grid space
      const yOffset = height < itemTileSize ? Math.ceil((itemTileSize - height) / 2) : 0
      const xOffset = width < itemTileSize ? Math.ceil((itemTileSize - width) / 2) : 0

      coordinates.push({ height, width, x: x + xOffset, y: y + yOffset })
    }

    return coordinates
  }

  /**
   * @function constructor
   *
   * @param {Array<Object>} dimensions
   * @param {Object<String,Number>} config
   *
   **/
  constructor (dimensions, config) {
    this.#config = config
    this.#dimensions = dimensions
    this.#coordinates = this.#doLayout()
  }

  /**
   * @return {Object}
   * @property {Number} height
   * @property {Number} width
   **/
  get extents () {
    const { bottomMargin, width } = this.#config
    const height = Math.ceil(Math.max(...this.coordinates.map((coord) => coord.y + coord.height))) + bottomMargin

    return { height, width }
  }

  get coordinates () {
    return this.#coordinates
  }
}

/**
 * @class  Compositor
 *
 * Class for managing overlay and grid composites of images.
 *
 */
export default class Compositor {
  constructor (iiifConfig) {
    const { dirs, printComposites } = iiifConfig

    this.iiifConfig = iiifConfig
    this.gridConfig = printComposites
    this.outputRoot = dirs.outputRoot
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
  async createCompositeGrid (inputImages, outputPath) {
    const { itemTileSize } = this.gridConfig

    // Get the sizes of `images` and calculate layout extents and coordinates
    const filepath = path.posix.join(this.outputRoot, outputPath)
    fs.ensureDirSync(path.posix.parse(filepath).dir)

    const images = inputImages.map((src) => sharp(src))
    const metadatas = await Promise.all(images.map(async (s) => await s.metadata()))
    const layout = new Layout(metadatas, this.gridConfig)

    const { height, width } = layout.extents

    if (fs.pathExistsSync(filepath)) {
      logger.debug(`skipping previously transformed image '${filepath}'`)
      return { height, width }
    }

    const canvas = sharp({
      create: {
        background: { r: 256, g: 256, b: 256, alpha: 1 },
        channels: 4,
        height,
        width
      }
    })

    // Create layers from each resized image
    const layers = []

    // NB: Index iteration avoids early-executing promise in async forEach()
    for (let i = 0; i < images.length; i++) {
      const image = await images[i].resize({
        width: itemTileSize,
        height: itemTileSize,
        fit: 'inside'
      })
      const { x: left, y: top } = layout.coordinates[i]

      const buffer = await image.toBuffer()

      layers.push({
        blend: 'atop',
        input: buffer,
        left,
        top
      })
    }

    // Perform the composite
    canvas.composite(layers)

    await canvas.jpeg().toFile(filepath)

    return { height, width }
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
    const { height, width } = await sharp(base).metadata()
    const canvas = sharp({
      create: {
        background: { r: 0, g: 0, b: 0, alpha: 1 },
        channels: 4,
        height,
        width
      }
    })

    // Create layer configurations for each image and perform the composite
    const layers = images.map((annotation) => {
      return {
        input: annotation
      }
    })
    canvas.composite(layers)

    const filepath = path.posix.join(this.outputRoot, outputPath)
    await canvas.jpeg().toFile(filepath)

    return { height, width }
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
