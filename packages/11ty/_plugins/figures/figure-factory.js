const AnnotationFactory = require('./annotation-factory')
const chalkFactory = require('~lib/chalk')
const Manifest = require('./iiif/manifest')
const ManifestWriter = require('./iiif/manifest/writer')
const path = require('path')
const transform = require('./transform')
const Tiler = require('./iiif/tiler')
const { getPrintImage, isCanvas, isImageService } = require('./helpers')

const logger = chalkFactory('Figure Processing')

module.exports = class FigureFactory {
  constructor(eleventyConfig) {
    const { iiifConfig } = eleventyConfig.globalData
    this.annotationFactory = new AnnotationFactory(iiifConfig)
    this.errors = []
    this.iiifConfig = iiifConfig
    this.tiler = new Tiler(iiifConfig)
    this.writer = new ManifestWriter(iiifConfig)
  }

  /**
   * Creates a Quire figure
   * Including image file transformations, tiles, and IIIF manifests
   *
   * @param {Object} figure Figure entry data from `figures.yaml`
   * 
   * @typedef {Object} Figure
   * @property {Array<AnnotationSet>} annotations
   * @property {String} canvasId ID of IIIF canvas
   * @property {Boolean} isCanvas True if figure contains a canvas resource
   * @property {Boolean} isExternalResource True if figure references an externally hosted resource
   * @property {Boolean} isImageService True if figure contains an image service resource
   * @manifestId {String} manifestId ID of IIIF manifest
   * @printImage {String} printImage Optional path to an alternate image to use in print
   * 
   * @return {Figure}
   */
  create(data) {
    /**
     * @typedef {Object} AnnotationSet
     * @property {String} input Input element type "radio|checkbox"
     * @property {Array<Annotation>} items
     * @return {Array<AnnotationSet>}
     */
    const annotations = () => {
      if (!Array.isArray(data.annotations)) return
      return data.annotations.map((set) => {
        set.items = set.items.map(
          (item) => this.annotationFactory.create(data, item)
        )
        return set
      })
    }

    /**
     * Create image annotation for "base" image on canvas
     */
    const baseImage = () => {
      if (!data.src) return
      return this.annotationFactory.create(data, {
        label: data.label,
        src: data.src
      })
    }

    return  {
      annotations: annotations(),
      baseImage: baseImage(),
      canvasId: data.canvasId,
      isCanvas: isCanvas(data),
      isExternalResource: (data.src && data.src.startsWith('http')) || data.manifestId,
      isImageService: isImageService(data),
      manifestId: data.manifestId,
      printImage: getPrintImage(this.iiifConfig, data),
      outputDir: path.join(this.iiifConfig.dirs.output, data.id),
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
    const manifest = new Manifest({ figure, iiifConfig: this.iiifConfig, writer: this.writer })
    const manifestJSON = await manifest.write()
    return { 
      canvasId: manifestJSON.items[0].id,
      manifestId: manifestJSON.id
    }
  }
}
