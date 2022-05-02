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
    supportedImageExtensions,
    tileSize
  } = eleventyConfig.globalData.iiifConfig

  /**
   * Tile an image for IIIF image service
   * @param  {String} input   input file path
   * @param  {Object} options
   */
  return async function(input, options = {}) {
    const { debug, lazy } = options

    const { ext, name } = path.parse(input)

    if (!supportedImageExtensions.includes(ext) && debug) {
      console.warn(`[iiif:tileImage:${name}] Image file is not a supported image type, skipping. File: `, name)
      return;
    }

    const outputDir = path.join(root, output)
    const tileDirectory = path.join(outputDir, name, imageServiceDirectory)

    if (fs.pathExistsSync(tileDirectory) && lazy && debug) {
      console.warn(`[iiif:tileImage:${name}] Tiles already exist, skipping`)
      return
    }

    fs.ensureDirSync(tileDirectory)

    const iiifId = path.join(
      baseURL,
      outputDir.split(path.sep).slice(1).join(path.sep),
      name
    )

    if (debug) {
      console.warn(`[iiif:tileImage:${name}] Starting`)
    }
    await sharp(input)
      .tile({
        id: iiifId,
        layout: 'iiif',
        size: 512
      })
      .toFile(tileDirectory)
    if (debug) {
      console.warn(`[iiif:tileImage:${name}] Done`)
    }
  }
}
