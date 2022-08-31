const { getPrintImage, isCanvas, isImageService } = require('./helpers')
const tileImage = require('./iiif/tile-image')
const transform = require('./transform')
const Manifest = require('./iiif/manifest')
const ManifestWriter = require('./iiif/manifest/writer')

module.exports = class Figure {
  constructor(eleventyConfig, data) {
    this.iiifConfig = eleventyConfig.globalData.iiifConfig
    this.data = {
      ...data,
      isCanvas: isCanvas(data),
      isImageService: isImageService(data),
      printImage: getPrintImage(eleventyConfig, data)
    }
    this.writer = new ManifestWriter(eleventyConfig)
  }

  get isExternalResource() {
    return (this.data.src && this.data.src.startsWith('http')) || this.data.manifestId
  }

  async create() {
    if (this.isImageService && !this.isExternalResource) {
      await transform(this.iiifConfig, this.data)
      const response = await tileImage(this.iiifConfig, this.data)
      this.data.info = response.id
    }

    if (this.data.isCanvas && !this.isExternalResource) {
      await this.generateManifest()
    }

    return Promise.resolve(this.data)
  }

  async generateManifest() {
    const manifest = new Manifest({ figure: this.data, writer: this.writer })
    const manifestJSON = await manifest.write()
    this.data.canvasId = manifestJSON.items[0].id
    this.data.manifestId = manifestJSON.id
  }
}
