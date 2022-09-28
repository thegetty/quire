const chalkFactory = require('~lib/chalk')
const fs = require('fs-extra')
const path = require('path')
const sharp = require('sharp')
const logger = chalkFactory('plugins:iiif:createImage')

/**
 * @param  {Object} config Quire IIIF Process config
 * @return {Function}      createImage()
 */
module.exports = class Transformer {
  constructor(iiifConfig) {
    this.iiifConfig = iiifConfig
  }

  /**
   * Creates a `sharp/transform` that writes the image file to the output directory.
   * Nota bene: this `transform` is distinct form `11ty/transform`
   *
   * @param  {Object} transformation A transformation item from `iiif/config.js#transformations`
   * @property  {String} name The name of the file
   * @property  {Object} resize Resize options for `sharp`
   */
  async transform({ src, outputDir, transformation }, options = {}) {
    const { region } = options
    const {
      dirs,
      formats
    } = this.iiifConfig

    if (!src) return
    const { ext, name } = path.parse(src)
    const format = formats.find(({ input }) => input.includes(ext))
    const inputPath = path.join(dirs.inputRoot, dirs.input, src)

    const { resize } = transformation
    const outputPath = path.join(dirs.outputRoot, outputDir, name, `${transformation.name}${format.output}`)

    fs.ensureDirSync(path.parse(outputPath).dir)

    if (!fs.pathExistsSync(outputPath)) {
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
        logger.error(`${src} ${error}`)
      }
    }
  }
}
