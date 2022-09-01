const AnnotationFactory = require('./annotation-factory')
const chalkFactory = require('~lib/chalk')
const Tiler = require('./iiif/tiler')
const transform = require('./transform')
const Manifest = require('./iiif/manifest')
const ManifestWriter = require('./iiif/manifest/writer')
const logger = chalkFactory('Figure Processing')
const { getPrintImage, isCanvas, isImageService } = require('./helpers')

module.exports = class FigureFactory {
  constructor(eleventyConfig) {
    const { iiifConfig } = eleventyConfig.globalData
    this.annotationFactory = new AnnotationFactory(iiifConfig)
    this.errors = []
    this.iiifConfig = iiifConfig
    this.tiler = new Tiler(iiifConfig)
    this.writer = new ManifestWriter(iiifConfig)
  }

  get annotations() {
    if (!Array.isArray(this.data.annotations)) return
    return this.data.annotations.map((set) => {
      set.items = set.items.map(
        (item) => this.annotationFactory.create(this.data, item)
      )
      return set
    })
  }

  /**
   * Create image annotation for "base" image on canvas
   */
  get baseImage() {
    if (!this.data.src) return
    return this.annotationFactory.create(this.data, {
      label: this.data.label,
      src: this.data.src
    })
  }

  /**
   * Returns the data representation of a figure to be consumed by components
   */

  /**
   * Creates a Quire figure
   * Including image file transformations, tiles, and IIIF manifests
   * 
   * @return {Object} Figure instance
   */
  create(data) {
    this.data = data
    return  {
      annotations: this.annotations,
      baseImage: this.baseImage,
      canvasId: data.canvasId,
      isCanvas: isCanvas(data),
      isExternalResource: (data.src && data.src.startsWith('http')) || data.manifestId,
      isImageService: isImageService(data),
      manifestId: data.manifestId,
      printImage: getPrintImage(this.iiifConfig, data),
      ...data
    }
  }

  async process(figure) {
    if (figure.isImageService && !figure.isExternalResource) {
      logger.info(`Creating image service for figure "${figure.id}"`)
      await transform(this.iiifConfig, figure)
      const { errors, info } = await this.tiler.tile(figure)
      figure.info = info
      errors ? this.errors = this.errors.concat(errors) : null
    }

    if (figure.isCanvas && !figure.isExternalResource) {
      const { canvasId, manifestId } = await this.generateManifest(figure)
      figure.canvasId = canvasId
      figure.manifestId = manifestId
    }

    return Promise.resolve({
      data: figure,
      errors: this.errors
    })
  }

  /**
   * Creates and writes manifest.json
   * Sets canvasId and manifestId properties on the figure instance
   */
  async generateManifest(figure) {
    const manifest = new Manifest({ figure, writer: this.writer })
    const manifestJSON = await manifest.write()
    return { 
      canvasId: manifestJSON.items[0].id,
      manifestId: manifestJSON.id
    }
  }
}
