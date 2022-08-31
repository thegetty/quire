const fs = require('fs-extra')
const path = require('path')
const sharp = require('sharp')

/**
 * @param  {Object} iiifConfig
 * @return {Function}      tileImage()
 */
module.exports = async (iiifConfig, figure, options = {}) => {
  const {
    baseURL,
    formats,
    imageServiceDirectory,
    inputDir,
    inputRoot,
    outputDir,
    outputRoot,
    tileSize
  } = iiifConfig

  /**
   * Tile an image for IIIF image service
   * @param  {String} figure   Figure entry data from `figures.yaml`
   * @param  {Object} options
   */
  const { debug, lazy } = options

  const { src } = figure
  const { ext, name } = path.parse(src)
  const inputPath = path.join(inputRoot, inputDir, src)
  const outputPath = path.join(outputRoot, outputDir, name, imageServiceDirectory)
  const format = formats.find(({ input }) => input.includes(ext))
  const supportedImageExtensions = formats.flatMap(( { input }) => input)

  if (!supportedImageExtensions.includes(ext)) {
    if (debug) {
      console.warn(`[iiif:tileImage:${name}] Image file is not a supported image type, skipping. File: `, name)
    }
    return {
      error: `Image file type is not supported. Supported extensions are: ${supportedImageExtensions.join(', ')}`,
      src
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
    const response = await sharp(inputPath)
      .toFormat(format.output.replace('.', ''))
      .tile({
        id: iiifId,
        layout: 'iiif',
        size: tileSize
      })
      .toFile(outputPath)
    return {
      id: iiifId,
      response
    }
  } catch(error) {
    return { error, src }
  }
}
