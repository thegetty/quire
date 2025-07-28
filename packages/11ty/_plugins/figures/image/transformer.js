import chalkFactory from '#lib/chalk/index.js'
import Fetch from '@11ty/eleventy-fetch'
import fs from 'fs-extra'
import path from 'node:path'
import sharp from 'sharp'
import slugify from '@sindresorhus/slugify'

const logger = chalkFactory('Figures:ImageTransformer', 'DEBUG')

/**
 * @function iiifSize
 *
 * @param {Object} resize - resize transform options
 *
 * @return an IIIF Image size param representing this transform
 **/
const iiifSize = (resize, imgInfo) => {
  const { width } = imgInfo
  const { width: xformWidth, withoutEnlargement } = resize

  let reqWidth = xformWidth
  if (xformWidth > width && withoutEnlargement) {
    reqWidth = width
  }

  // TODO: Add ^ if this is a v3 endpoint -- in imgInfo.profiles look for http://iiif.io/api/image/2/level2.json, etc
  return `${reqWidth},`
}

/**
 * @param  {Object} iiifConfig Quire IIIF Process config
 */
export default class Transformer {
  constructor (iiifConfig) {
    const { dirs, formats } = iiifConfig
    this.formats = formats
    this.outputRoot = dirs.outputRoot
  }

  /**
   * Creates a `sharp/transform` that writes the image file to the output directory.
   * Nota bene: this `transform` is distinct form `11ty/transform`
   *
   * @property {String} inputPath The path to the image file to transform
   * @property  {Object} transformation A transformation item from `iiif/config.js#transformations`
   * @param  {Object} options
   * @property  {Object} resize Resize options for `sharp`
   * @return {Promise}
   */
  async transform (inputPath, outputDir, transformation, options = {}) {
    if (!inputPath) return {}

    const { region, iiifEndpoint } = options
    const { resize } = transformation

    let ext, name
    if (iiifEndpoint) {
      ext = '.jpg'
      name = slugify(inputPath)
    } else {
      ({ ext, name } = path.parse(inputPath))
    }

    const format = this.formats.find(({ input }) => input.includes(ext))
    const outputPath = path.join(this.outputRoot, outputDir, name, `${transformation.name}${format.output}`)

    fs.ensureDirSync(path.parse(outputPath).dir)

    if (fs.pathExistsSync(outputPath)) {
      logger.debug(`skipping previously transformed image '${inputPath}'`)
      return
    }

    // If this is an IIIF endpoint, download with the appropriate size params
    if (iiifEndpoint) {
      const iiifUrl = inputPath.endsWith('/') ? inputPath : inputPath + '/'

      // Will need info for profile detection (v2/v3) and dimensions
      const infoUrl = new URL('info.json', iiifUrl)

      const info = await Fetch(infoUrl.href, { type: 'json' })

      // Construct the transform URL and save to disk
      const size = iiifSize(resize, info)
      const imageUrl = new URL(`full/${size}/0/default.jpg`, iiifUrl)

      const image = await Fetch(imageUrl.href)
      const buf = Buffer.from(image)

      return new Promise((resolve, reject) => {
        fs.createWriteStream(outputPath).write(buf)
        logger.debug(`Wrote buffer to ${outputPath}`)
        resolve()
      })
    }

    /**
     * Declare a `sharp` service with a `crop` method that is callable
     * without a `region`, which the sharp API `extract` method does not allow
     */
    const service = sharp(inputPath)
    service.crop = function (region) {
      if (!region) return this
      const [top, left, width, height] = region.split(',').map((item) => parseFloat(item.trim()))
      service.extract({ top, left, width, height })
      return this
    }
    return service
      .crop(region)
      .resize(resize)
      .withMetadata()
      .toFile(outputPath)
  }
}
