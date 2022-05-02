const fs = require('fs-extra')
const path = require('path')
const sharp = require('sharp')

/**
 * @param  {Object} eleventyConfig
 * @return {Function}      tileImage()
 */
module.exports = (eleventyConfig) => {
  const {
    baseURL,
    imageServiceDirectory,
    output,
    root,
    tileSize
  } = eleventyConfig.globalData.iiifConfig

  /**
   * Tile an image for IIIF image service
   * @param  {String} input   input file path
   * @param  {Object} options
   */
  return async function(input, options = {}) {
    const { debug, lazy } = options

    const id = path.parse(input).name

    const outputDir = path.join(root, output)
    const tileDirectory = path.join(outputDir, id, imageServiceDirectory)

    if (fs.pathExistsSync(tileDirectory) && lazy && debug) {
      console.warn(`[iiif:tileImage:${id}] Tiles already exist, skipping`)
      return
    }

    fs.ensureDirSync(tileDirectory)

    const iiifId = path.join(
      baseURL,
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
