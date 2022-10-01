const chalkFactory = require('~lib/chalk')
const fs = require('fs-extra')
const path = require('path')
const sharp = require('sharp')

const logger = chalkFactory('plugins:iiif:createImage')

/**
 * @param  {Object} iiifConfig Quire IIIF Process config
 */
module.exports = class Transformer {
  constructor(iiifConfig) {
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
   */
  async transform(inputPath, outputDir, transformation, options = {}) {
    if (!inputPath) return {}

    const { region } = options
    const { resize } = transformation
    const { ext, name } = path.parse(inputPath)
    const format = this.formats.find(({ input }) => input.includes(ext))
    const outputPath = path.join(this.outputRoot, outputDir, name, `${transformation.name}${format.output}`)

    fs.ensureDirSync(path.parse(outputPath).dir)

    if (fs.pathExistsSync(outputPath)) {
      return {
        messages: ['Image has already been transformed. Skipping.']
      }
    }

    try {
      /**
       * Declare a `sharp` service with a `crop` method that can be
       * called without a region, which the sharp API method `extract` does not allow
       */
      const service = sharp(inputPath)
      service.crop = function (region) {
        if (!region) return this
        const [ top, left, width, height ] = region.split(',').map((item) => parseFloat(item.trim()))
        service.extract({ top, left, width, height })
        return this
      }
      return await service
        .crop(region)
        .resize(resize)
        .withMetadata()
        .toFile(outputPath)
    } catch (error) {
      return { errors: [error] }
    }
  }
}
