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
   * Creates an image in the output directory with the name `thumb.${ext}`
   *
   * @param {Object} config
   * @property  {String} input   input file path
   * @param  {Object} options
   * @property  {String} name    Overwrite the name of the file
   */
  return async (input, options = {}) => {
    const { debug, lazy, resize } = options
    const outputDir = path.join(root, output)

    name = options.name || path.parse(input).name
    ext = path.parse(name).ext || path.parse(input).ext

    const id = path.parse(input).name
    const filename = `${name}${ext}`

    fs.ensureDirSync(path.join(outputDir, id))
    const fileOutput = path.join(outputDir, id, filename)

    if (!lazy || !fs.pathExistsSync(fileOutput)) {
      await sharp(input)
        .resize(options.resize)
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
