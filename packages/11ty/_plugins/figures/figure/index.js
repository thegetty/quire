const Annotation = require('../annotation')
const AnnotationFactory = require('../annotation/factory')
const ImageProcessor = require('../image/processor')
const Manifest = require('../iiif/manifest')
const path = require('path')
const { isCanvas, isImageService } = require('../helpers')

/**
 * @param {Object} iiifConfig
 * @param {Object} data Figure entry data from `figures.yaml`
 * 
 * @typedef {Object} Figure
 * @property {Array<AnnotationSet>} annotations
 * @property {String} canvasId ID of IIIF canvas
 * @property {Boolean} isCanvas True if figure contains a canvas resource
 * @property {Boolean} isExternalResource True if figure references an externally hosted resource
 * @property {Boolean} isImageService True if figure contains an image service resource
 * @property {String} manifestId ID of IIIF manifest
 * @property {String} printImage Optional path to an alternate image to use in print
 */
module.exports = class Figure {
  constructor(iiifConfig, data) {
    const { baseURL, dirs, manifestFilename } = iiifConfig
    const outputDir = path.join(dirs.output, data.id)
    const iiifBaseId = [baseURL, outputDir].join('/')   
    const canvasId = isCanvas(data) ? data.canvasId || [iiifBaseId, 'canvas'].join('/') : null
    const manifestId = isCanvas(data) ? data.manifestId || [iiifBaseId, manifestFilename].join('/') : null

    this.annotationFactory = new AnnotationFactory(this)
    this.canvasId = canvasId
    this.data = data
    this.id = data.id
    this.imageProcessor = new ImageProcessor(iiifConfig)
    this.iiifConfig = iiifConfig
    this.isCanvas = isCanvas(data)
    this.isImageService = isImageService(data)
    this.label = data.label
    this.manifestId = manifestId
    this.outputDir = outputDir
    this.src = data.src
  }

  get annotations() {
    return this.annotationFactory.create()
  }

  /**
   * Represents the "base" figure image defined in `figure.src` as an annotation
   * for use in IIIF manifests
   * @return {Annotation|null}
   */
  get baseImageAnnotation() {
    const { src, label } = this.data
    return src && this.isCanvas
      ? new Annotation(this, { label, src })
      : null
  }

  /**
   * If the `src` is an external resource
   * @return {Boolean}
   */
  get isExternalResource() {
    return (this.src && this.src.startsWith('http')) || this.data.manifestId
  }

  /**
   * The full path to the `info.json` if figure.src is an image service
   * @return {String}
   */
  get info() {
    if (!this.isImageService || !this.src) return
    const { name } = path.parse(this.src)
    const tileDirectory = path.join(this.outputDir, name, this.iiifConfig.dirs.imageService)
    return new URL(path.join(tileDirectory, 'info.json'), this.iiifConfig.baseURL).href
  }

  /**
   * The path to print representation of the figure for use in EPUB & PDF
   */
  get printImage() {
    if (this.src && !this.data.printImage) {
      const { ext, name } = path.parse(this.src)
      return path.join(this.outputDir, `print-image${ext}`)
    }
    return this.data.printImage
  }

  /**
   * Return only the data properties consumed by quire shortcodes
   * @return {Object} figure
   */
  adapter() {
    return {
      ...this.data,
      annotations: this.annotations,
      canvasId: this.canvasId,
      id: this.id,
      info: this.info,
      isCanvas: this.isCanvas,
      isImageService: this.isImageService,
      label: this.label,
      manifestId: this.manifestId,
      printImage: this.printImage,
      src: this.src
    }
  }

  /**
   * Call file process methods and return errors
   * 
   * @return {Object}
   * @property {Array} errors
   */
  async processFiles() {
    this.errors = []

    await this.processAnnotationImages()
    await this.processFigureImage()
    await this.processManifest()

    return { errors: this.errors }
  }

  /**
   * Process annotation images
   */
  async processAnnotationImages() {
    if (!this.annotations) return
    const annotationItems = this.annotations.flatMap(({ items }) => items)
    const imageResponses = await Promise.all(annotationItems.map((item) => {
      return this.imageProcessor.processImage(item.src, this.outputDir, {
        tile: item.isImageService
      })
    }))
    const errors = imageResponses.flatMap(({ errors }) => errors || [])
    if (errors.length) this.errors = this.errors.concat(errors)
  }

  /**
   * Process `figure.src`
   */
  async processFigureImage() {
    if (this.src && (this.isCanvas || this.isImageService)) {
      const { transformations } = this.iiifConfig
      const { errors } = await this.imageProcessor.processImage(this.src, this.outputDir, {
        tile: this.isImageService,
        transformations
      })
      if (errors) this.errors = this.errors.concat(errors)
    }
  }

  /**
   * Create IIIF `manifest.json` file
   */
  async processManifest() {  
    if (this.isCanvas && !this.isExternalResource) {
      const manifest = new Manifest(this)
      const jsonResponse = await manifest.toJSON()
      if (jsonResponse.errors) this.errors = this.errors.concat(jsonResponse.errors)
      const writeResponse = await manifest.write()
      if (writeResponse.errors) this.errors = this.errors.concat(writeResponse.errors)
    }
  }
}
