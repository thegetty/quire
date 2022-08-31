const chalkFactory = require('~lib/chalk')
const ImageTiler = require('./iiif/image-tiler')
const transform = require('./transform')
const Manifest = require('./iiif/manifest')
const ManifestWriter = require('./iiif/manifest/writer')
const { info } = chalkFactory('Figure Processing')
const { getPrintImage, isCanvas, isImageService } = require('./helpers')

module.exports = class Figure {
  constructor(eleventyConfig, data) {
    this.annotations = data.annotations
    this.aspectRatio = data.aspect_ratio
    this.canvasId = data.canvasId
    this.caption = data.caption
    this.credit = data.credit
    this.eleventyConfig = eleventyConfig
    this.errors = []
    this.id = data.id
    this.info = data.info
    this.isCanvas = isCanvas(data)
    this.isImageService = isImageService(data)
    this.label = data.label
    this.manifestId = data.manifestId
    this.mediaId = data.media_id
    this.mediaType = data.media_type
    this.poster = data.poster
    this.preset = data.preset
    this.printImage = getPrintImage(eleventyConfig, data)
    this.region = data.region
    this.src = data.src
    this.tiler = new ImageTiler(eleventyConfig, data)
  }

  get iiifConfig() {
    return this.eleventyConfig.globalData.iiifConfig
  }

  get isExternalResource() {
    return (this.src && this.src.startsWith('http')) || this.manifestId
  }

  get writer() {
    return new ManifestWriter(this.eleventyConfig)
  }

  /**
   * Returns the data representation of a figure to be consumed by components
   */
  adapter() {
    return {
      annotations: this.annotations,
      aspectRatio: this.aspectRatio,
      canvasId: this.canvasId,
      caption: this.caption,
      credit: this.credit,
      id: this.id,
      info: this.info,
      isCanvas: this.isCanvas,
      isImageService: this.isImageService,
      label: this.label,
      manifestId: this.manifestId,
      mediaId: this.mediaId,
      mediaType: this.mediaType,
      poster: this.poster,
      preset: this.preset,
      printImage: this.printImage,
      region: this.region,
      src: this.src
    }
  }

  /**
   * Creates a Quire figure
   * Including image file transformations, tiles, and IIIF manifests
   * 
   * @return {Object} Figure instance
   */
  async create() {
    if (this.isImageService && !this.isExternalResource) {
      info(`Creating image service for figure "${this.id}"`)
      await transform(this.iiifConfig, this)
      const { errors, id } = await this.tiler.tile()
      errors ? this.errors = this.errors.concat(errors) : null
      this.info = id
    }

    if (this.isCanvas && !this.isExternalResource) {
      await this.generateManifest()
    }

    return Promise.resolve(this)
  }

  /**
   * Creates and writes manifest.json
   * Sets canvasId and manifestId properties on the figure instance
   */
  async generateManifest() {
    const manifest = new Manifest({ figure: this.adapter(), writer: this.writer })
    const manifestJSON = await manifest.write()
    this.updateFigure({ 
      canvasId: manifestJSON.items[0].id,
      manifestId: manifestJSON.id
    })
  }

  updateFigure(data) {
    Object.assign(this, data)
  }
}
