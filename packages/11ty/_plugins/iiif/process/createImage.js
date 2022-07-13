const chalkFactory = require('~lib/chalk')
const fs = require('fs-extra')
const path = require('path')
const sharp = require('sharp')

const { info, error } = chalkFactory('plugins:iiif:createImage')

/**
 * @param  {Object} config Quire IIIF Process config
 * @return {Function}      createImage()
 */
module.exports = (eleventyConfig) => {
  const { inputDir, outputDir, outputRoot } = eleventyConfig.globalData.iiifConfig

  /**
   * Creates an image in the output directory with the name `${name}${ext}`
   *
   * @param  {String} input Input file path
   * @param  {Object} transformation A transformation item from `iiif/config.js#imageTransformations`
   * @property  {String} name The name of the file
   * @property  {Object} resize Resize options for `sharp`
   */
  return async (filename, transformation = {}, options) => {
    const { debug, lazy } = options

    const { ext, name } = path.parse(filename)
    const inputPath = path.join(inputDir, filename)
    const outputPath = path.join(outputRoot, outputDir, name, `${transformation.name}${ext}`)

    fs.ensureDirSync(path.parse(outputPath).dir)

    if (!lazy || !fs.pathExistsSync(outputPath)) {
      if (debug) {
        info(`Created ${filename}`)
      }
      try {
        return await sharp(inputPath)
          .resize(resize)
          .withMetadata()
          .toFile(outputPath)
      } catch(errorMessage) {
        error(`${filename} ${errorMessage}`)
      }
    }
  }
}
