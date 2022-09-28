const fs = require('fs-extra')
const path = require('path')
const Tiler = require('./tiler')
const Transformer = require('./transformer')

module.exports = class ImageFactory {
  constructor(iiifConfig) {
    this.iiifConfig = iiifConfig
    this.tiler = new Tiler(iiifConfig)
    this.transformer = new Transformer(iiifConfig)
  }

  async process({ src, outputDir }, options = {}) {
    if (src.startsWith('http')) return {}

    const response = {
      errors: []
    }

    const { dirs } = this.iiifConfig

    const inputPath = path.join(dirs.inputRoot, dirs.input, src)
    const outputPath = path.join(dirs.outputRoot, outputDir)

    if (options.transformations) {
      await Promise.all(
        transformations.map((transformation) => {
          return this.transformer({ inputPath, outputPath, transformation }, options)
        })
      )
    }

    if (options.tile) {
      const { errors, info } = await this.tiler.tile(inputPath, outputDir)
      if (errors) response.errors.push(...errors)
      response.info = info
    } else {
      //copy passthrough
      const { base } = path.parse(src)
      fs.copySync(inputPath, path.join(outputPath, base))
    }

    return response
  }
} 
