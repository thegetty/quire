const chalkFactory = require('~lib/chalk')
const fs = require('fs-extra')
const path = require('path')
const sharp = require('sharp')
const { info } = chalkFactory('Figure Processing:IIIF:Tile Image')


module.exports = class Tiler {
  /**
   * @param  {Object} iiifConfig 
   */
  constructor(iiifConfig) {
    this.iiifConfig = iiifConfig
    this.supportedImageExtensions = iiifConfig.formats.flatMap(({ input }) => input)
  }

  /**
   * Tile an image for IIIF image service using sharp
   * @param  {String} figure   Figure entry data from `figures.yaml`
   * @param  {Object}
   */
  async tile(figure) {
    if (!figure.src) return
    const { ext, name } = path.parse(figure.src)

    if (!this.supportedImageExtensions.includes(ext)) {
      return {
        errors: [`Image file type is not supported. Supported extensions are: ${this.supportedImageExtensions.join(', ')}`,]
      }
    }

    const {
      baseURL,
      dirs,
      formats,
      tileSize
    } = this.iiifConfig

    const format = formats.find(({ input }) => input.includes(ext))
    const inputPath = path.join(dirs.inputRoot, dirs.input, figure.src)
    const tileDirectory = path.join(figure.outputDir, name, dirs.imageService)
    const url = new URL(path.join(tileDirectory, 'info.json'), baseURL).href

    if (fs.existsSync(path.join(dirs.outputRoot, tileDirectory, 'info.json'))) {
      info(`Skipping previously tiled image "${inputPath}"`)
      return { info: url }
    }
    fs.ensureDirSync(tileDirectory)

    try {
      info(`Tiling image: "${inputPath}"`)
      const response = await sharp(inputPath)
        .toFormat(format.output.replace('.', ''))
        .tile({
          id: url,
          layout: 'iiif',
          size: tileSize
        })
        .toFile(path.join(dirs.outputRoot, tileDirectory))
      info(`Done tiling image "${inputPath}"`)
      return { info: url }
    } catch(error) {
      return { errors: [error] }
    }
  }
}
