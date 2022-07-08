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
    inputDir,
    outputDir,
    outputRoot,
    supportedImageExtensions,
    tileSize
  } = eleventyConfig.globalData.iiifConfig

  /**
   * Tile an image for IIIF image service
   * @param  {String} filename   filename File name and extension
   * @param  {Object} options
   */
  return async function(filename, options = {}) {
    const { debug, lazy } = options

    const { ext, name } = path.parse(filename)
    const inputPath = path.join(inputDir, filename)
    const outputPath = path.join(outputRoot, outputDir, name, imageServiceDirectory)

    if (!supportedImageExtensions.includes(ext)) {
      if (debug) {
        console.warn(`[iiif:tileImage:${name}] Image file is not a supported image type, skipping. File: `, name)
      }
      return {
        error: `Image file type is not supported. Supported extensions are: ${supportedImageExtensions.join(', ')}`,
        filename
      }
    }

    fs.ensureDirSync(outputPath)

    const iiifId = path.join(
      baseURL,
      outputDir.split(path.sep).slice(1).join(path.sep),
      name
    )

    try {
      if (debug) {
        console.log(`tileImage`, inputPath)
      }
      return await sharp(inputPath)
        .tile({
          id: iiifId,
          layout: 'iiif',
          size: 512
        })
        .toFile(outputPath)
    } catch(error) {
      return { error, filename }
    }
  }
}
