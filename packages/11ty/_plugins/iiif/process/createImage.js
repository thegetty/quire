const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const getId = require('./getId')

/**
 * @param  {Object} config Quire IIIF Process config
 * @return {Function}      createImage()
 */
module.exports = (config) => {
  const {
    output: defaultOutput, 
    root
  } = config

  /**
   * Creates an image in the output directory with the name `thumb.${ext}`
   *
   * @param {Object} config
   * @property  {String} input   input file path
   * @param  {Object} options
   * @property  {String} name    Overwrite the name of the file
   * @property  {String} output  Overwrite default output directory
   */
  return async (input, options = {}) => {
    const { debug, lazy, output, resize } = options
    const outputDir = output || path.join(root, defaultOutput)

    name = options.name || path.parse(input).name
    ext = path.parse(name).ext || path.parse(input).ext

    const id = getId(input)
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
