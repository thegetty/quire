const fs = require('fs-extra')
const path = require('path')
const sharp = require('sharp')

/**
 * @param  {Object} config Quire IIIF Process config
 * @return {Function}      createImage()
 */
module.exports = (eleventyConfig) => {
  const { inputDir, outputDir } = eleventyConfig.globalData.iiifConfig

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
    const { name, resize } = transformation

    const ext = path.parse(filename).ext
    const id = path.parse(filename).name
    const inputPath = path.join(inputDir, filename)
    const outputPath = path.join(outputDir, id, filename)

    fs.ensureDirSync(path.join(outputDir, id))

    if (!lazy || !fs.pathExistsSync(outputPath)) {
      await sharp(inputPath)
        .resize(resize)
        .withMetadata()
        .toFile(outputPath)

      if (debug) {
        console.warn(`[iiif:createImage:${id}] Created ${filename}`)
      }
    } else {
      if (debug) {
        console.warn(
          `[iiif:createImage:${id}] ${filename} already exists, skipping`
        )
      }
    }
  }
}
