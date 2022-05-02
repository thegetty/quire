const fs = require('fs-extra')
const path = require('path')
const sharp = require('sharp')

/**
 * @param  {Object} config Quire IIIF Process config
 * @return {Function}      createImage()
 */
module.exports = (eleventyConfig) => {
  const {
    output, 
    root
  } = eleventyConfig.globalData.iiifConfig

  /**
   * Creates an image in the output directory with the name `${name}${ext}`
   *
   * @param  {String} input Input file path
   * @param  {Object} transformation A transformation item from `iiif/config.js#imageTransformations`
   * @property  {String} name The name of the file
   * @property  {Object} resize Resize options for `sharp`
   */
  return async (input, transformation = {}, options) => {
    const { debug, lazy } = options
    const { name, resize } = transformation
    const outputDir = path.join(root, output)

    const ext = path.parse(input).ext
    const id = path.parse(input).name
    const filename = `${name}${ext}`

    fs.ensureDirSync(path.join(outputDir, id))
    const fileOutput = path.join(outputDir, id, filename)

    if (!lazy || !fs.pathExistsSync(fileOutput)) {
      await sharp(input)
        .resize(resize)
        .withMetadata()
        .toFile(fileOutput)

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
