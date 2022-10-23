const chalkFactory = require('~lib/chalk')
const Annotation = require('../annotation')
const AnnotationFactory = require('../annotation/factory')
const Manifest = require('../iiif/manifest')
const path = require('path')
const { isCanvas, isImageService } = require('../helpers')

const logger = chalkFactory('Figures:Figure', 'DEBUG')

/**
 * @param {Object} iiifConfig
 * @param {Function} processImage  Function to generate IIIF assets
 * @param {Object} data  Figure data from and entry in `figures.yaml`
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
  constructor(iiifConfig, imageProcessor, data) {
    const { baseURI, dirs, manifestFileName } = iiifConfig
    const outputDir = path.join(dirs.outputPath, data.id)
    /**
     * URI of the IIIF CanvasPanel element; a fully qualified URL.
     * @type  {URL|null}
     */
    const canvasId = isCanvas(data)
      ? data.canvasId || [baseURI, outputDir, 'canvas'].join('/')
      : null
    /**
     * URI of the IIIF manifest file; a fully qualified URL.
     * @type  {URL|null}
     */
    const manifestId = isCanvas(data)
      ? data.manifestId || [baseURI, outputDir, manifestFileName].join('/')
      : null

    this.annotationFactory = new AnnotationFactory(this)
    this.canvasId = canvasId
    this.data = data
    this.id = data.id
    this.processImage = imageProcessor
    this.iiifConfig = iiifConfig
    this.isCanvas = isCanvas(data)
    this.isImageService = isImageService(data)
    this.label = data.label
    this.manifestId = manifestId
    this.outputDir = outputDir
    this.src = data.src
  }

  /**
   * Figure image annotations
   * @type  {Array<Annotations>}
   */
  get annotations() {
    return this.annotationFactory.create()
  }

  /**
   * Represents the _base_ image for a figure defined in `figure.src`
   * as an annotation for use in IIIF manifests.
   * @type  {Annotations|null}
   */
  get baseImageAnnotation() {
    const { src, label } = this.data
    return src && this.isCanvas
      ? new Annotation(this, { label, src })
      : null
  }

  /**
   * Test if the `src` is an external resource
   * @type {Boolean}
   */
  get isExternalResource() {
    return (this.src && this.src.startsWith('http')) || this.manifestId
  }

  /**
   * Full path to the `info.json` for <image-service> components
   * @type {String}
   */
  get info() {
    if (!this.isImageService || !this.src) return
    const { baseURI, tilesDirName } = this.iiifConfig
    const { name } = path.parse(this.src)
    const infoPath = path.join(this.outputDir, name, tilesDirName, 'info.json')
    return new URL(infoPath, baseURI).toString()
  }

  /**
   * Path to a print representation of the figure for EPUB & PDF outputs
   * @type {String}
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
   * @todo refactor process and create methods to return a response
   * to encapsulate collection of errors into this method.
   *
   * @return {Object}
   * @property {Array} errors
   */
  async processFiles() {
    this.errors = []

    await this.processAnnotationImages()
    await this.processFigureImage()
    await this.createManifest()

    return { errors: this.errors }
  }

  /**
   * Process annotation images
   */
  async processAnnotationImages() {
    if (!this.annotations) return
    const annotationItems = this.annotations.flatMap(({ items }) => items)
    const results = await Promise.all(annotationItems.map((item) => {
      logger.debug(`processing annotation image ${item.src}`)
      return item.src && this.processImage(item.src, this.outputDir, {
        tile: item.isImageService
      })
    }))
    const errors = results.flatMap(({ errors }) => errors || [])
    if (errors.length) this.errors = this.errors.concat(errors)
  }

  /**
   * Process `figure.src`
   */
  async processFigureImage() {
    if (this.src && this.isImageService) {
      const { transformations } = this.iiifConfig
      const { errors } = await this.processImage(this.src, this.outputDir, {
        tile: true,
        transformations
      })
      if (errors) this.errors = this.errors.concat(errors)
    }
  }

  /**
   * Create the IIIF `manifest.json` for <canvas-panel> components,
   * collect errors from calling toJSON and the file system writer.
   *
   * @todo the `figure` should not need to know to call `toJSON`,
   * building the JSON is a concern of either the `manifest` or perhaps;
   * refactor `createManifest` to only create the manifest instance
   * and call its `write` method.
   */
  async createManifest() {
    if (this.isCanvas && !this.isExternalResource) {
      const manifest = new Manifest(this)
      await manifest.toJSON()
        .then(({ errors }) => this.errors = this.errors.concat(errors))
      await manifest.write()
        .then(({ errors }) => this.errors = this.errors.concat(errors))
    }
  }
}
