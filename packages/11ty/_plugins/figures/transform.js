const chalkFactory = require('~lib/chalk')
const fs = require('fs-extra')
const path = require('path')
const sharp = require('sharp')

const { info, error } = chalkFactory('plugins:iiif:createImage')

/**
 * @param  {Object} config Quire IIIF Process config
 * @return {Function}      createImage()
 */
module.exports = (iiifConfig, figure, options={}) => {
  const {
    dirs,
    formats,
    transformations
  } = iiifConfig

  /**
   * Creates a `sharp/transform` that writes the image file to the output directory.
   * Nota bene: this `transform` is distinct form `11ty/transform`
   *
   * @param  {Object} transformation A transformation item from `iiif/config.js#transformations`
   * @property  {String} name The name of the file
   * @property  {Object} resize Resize options for `sharp`
   */
  const transform = async (transformation) => {

    const { debug, lazy } = options

    const { outputDir, region, src } = figure
    const { ext, name } = path.parse(src)
    const { resize } = transformation
    const format = formats.find(({ input }) => input.includes(ext))
    const inputPath = path.join(dirs.inputRoot, dirs.input, src)
    const outputPath = path.join(dirs.outputRoot, outputDir, name, `${transformation.name}${format.output}`)

    fs.ensureDirSync(path.parse(outputPath).dir)

    if (!lazy || !fs.pathExistsSync(outputPath)) {
      if (debug) {
        info(`Created ${src}`)
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
      } catch (errorMessage) {
        error(`${src} ${errorMessage}`)
      }
    }
  }

  return Promise.all(transformations.map(transform))
}
