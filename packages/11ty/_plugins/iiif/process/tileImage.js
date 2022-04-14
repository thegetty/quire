const fs = require('fs-extra')
const path = require('path')
const sharp = require('sharp')

/**
 * @param  {Object} config Quire IIIF Process config
 * @return {Function}      tileImage()
 */
module.exports = (config) => {
  const {
    output: defaultOutput,
    root
  } = config

  /**
   * Tile an image for IIIF image service
   * @param  {String} input   input file path
   * @param  {Object} options
   * @property {String} output   Overwrite default output path
   */
  return async function(input, options = {}) {
    const { debug, lazy, output } = options

    const { dir } = path.parse(input)
    const dirParts = dir.split(path.sep)
    const id = dirParts[dirParts.length - 1]

    const outputDir = output || path.join(root, defaultOutput)
    const tileDirectory = path.join(outputDir, id, 'tiles')

    if (fs.pathExistsSync(tileDirectory) && lazy) {
      console.warn(`[iiif:tileImage:${id}] Tiles already exist, skipping`)
      return
    }

    fs.ensureDirSync(tileDirectory)

    const iiifId = path.join(
      process.env.URL,
      outputDir.split(path.sep).slice(1).join(path.sep),
      id
    )

    if (debug) {
      console.warn(`[iiif:tileImage:${id}] Starting`)
    }
    await sharp(input)
      .tile({
        id: iiifId,
        layout: 'iiif',
        size: 512
      })
      .toFile(tileDirectory)
    if (debug) {
      console.warn(`[iiif:tileImage:${id}] Done`)
    }
  }
}
