import chalkFactory from '#lib/chalk/index.js'
import Fetch from '@11ty/eleventy-fetch'
import fs from 'fs-extra'
import path from 'node:path'
import sharp from 'sharp'
import slugify from '@sindresorhus/slugify'

const logger = chalkFactory('Figures:ImageTiler', 'DEBUG')

/**
 * Tiler
 *
 * @class  Tiler
 */
export default class Tiler {
  /**
   * @param  {Object} iiifConfig
   */
  constructor (iiifConfig) {
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
   * @param  {String} outputDir   Destination directory for the tiles
   * @return {Promise}
   */
  async tile (inputPath, outputDir, options) {
    if (!inputPath) return

    const { iiifEndpoint } = options
    let ext, name
    if (iiifEndpoint) {
      ext = '.jpg'
      name = slugify(inputPath)
    } else {
      ({ ext, name } = path.parse(inputPath))
    }

    if (!this.supportedExtensions.includes(ext)) {
      throw new Error(`Image file of type '${ext}' is not supported. Supported file types are: ${this.supportedExtensions.join(', ')}`)
    }

    const outputPath = path.join(this.outputRoot, outputDir, name, this.tilesDir)

    if (fs.existsSync(path.join(outputPath, 'info.json'))) {
      logger.debug(`skipping previously tiled image '${inputPath}'`)
      return
    }

    fs.ensureDirSync(outputPath)

    // For a IIIF image, download the full image and pass the buffer to sharp
    // TODO: Use a sensible full max here in case something is mega mega big?
    let imagePathOrBuf = inputPath
    if (iiifEndpoint) {
      const iiifUrl = inputPath.endsWith('/') ? inputPath : inputPath + '/'
      const fullParams = 'full/full/0/default.jpg'

      const fullImage = new URL(fullParams, iiifUrl)
      const response = await Fetch(fullImage.href)
      imagePathOrBuf = Buffer.from(response)
    }

    logger.debug(`tiling '${inputPath}'`)
    const format = this.formats.find(({ input }) => input.includes(ext))

    return sharp(imagePathOrBuf)
      .toFormat(format.output.replace('.', ''))
      .tile({
        id: new URL(path.join(outputDir, name), this.baseURI).toString(),
        layout: 'iiif',
        size: this.tileSize
      })
      .toFile(path.join(outputPath))
  }
}
