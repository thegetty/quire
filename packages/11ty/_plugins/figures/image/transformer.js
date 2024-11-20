const chalkFactory = require('~lib/chalk')
const fs = require('fs-extra')
const path = require('path')
const sharp = require('sharp')

const logger = chalkFactory('Figures:ImageTransformer', 'DEBUG')

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
   * @return {Promise}
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
      logger.debug(`skipping previously transformed image '${inputPath}'`)
      return
    }

    /**
     * Declare a `sharp` service with a `crop` method that is callable
     * without a `region`, which the sharp API `extract` method does not allow
     */
    const service = sharp(inputPath)
    service.crop = function (region) {
      if (!region) return this
      const [ top, left, width, height ] = region.split(',').map((item) => parseFloat(item.trim()))
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
