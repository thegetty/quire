const Annotation = require('../annotation')
const AnnotationFactory = require('../annotation/factory')
const ImageProcessor = require('../image/processor')
const Manifest = require('../iiif/manifest')
const path = require('path')
const sharp = require('sharp')
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

    const defaults = {
      mediaType: 'image'
    }

    const { 
      id,
      label,
      media_id: mediaId,
      media_type: mediaType,
      src,
      zoom
    } = data

    this.annotationFactory = new AnnotationFactory(this)
    this.canvasId = canvasId
    this.data = data
    this.id = id
    this.imageProcessor = new ImageProcessor(iiifConfig)
    this.iiifConfig = iiifConfig
    this.isCanvas = isCanvas(data)
    this.isImageService = isImageService(data)
    this.label = label
    this.manifestId = manifestId
    this.mediaType = mediaType || defaults.mediaType
    this.mediaId = mediaId
    this.outputDir = outputDir
    this.src = src
    this.zoom = zoom
  }

  get annotations() {
    return this.annotationFactory.create()
  }

  /**
   * When the figure is a canvas, represent the image
   * in `figure.src` as an annotation for use in IIIF manifests
   * @return {Annotation|null}
   */
  get baseImageAnnotation() {
    const { src, label } = this.data
    return src && this.isCanvas
      ? new Annotation(this, { label, src })
      : null
  }

  /**
   * Path to the image file that represents the canvas
   * Used to define canvas properties `width` and `height`
   */
  get canvasImagePath() {
    if (!this.isCanvas) return
    const firstChoiceSrc = () => {
      if (!this.annotations) return
      const firstChoice = this.annotations
        .flatMap(({ items }) => items)
        .find(({ target }) => !target)
      if (!firstChoice) return
      return firstChoice.src
    }
    const imagePath = this.src || firstChoiceSrc()
    if (!imagePath) {
      this.errors.push(`Invalid figure ID "${this.id}". Figures with annotations must have "choice" annotations or a "src" property.`)
      return
    }
    const { input, inputRoot } = this.iiifConfig.dirs
    return path.join(inputRoot, input, imagePath)
  }

  /**
   * If the `src` is an external resource
   * @return {Boolean}
   */
  get isExternalResource() {
    return (this.src && this.src.startsWith('http')) || this.data.manifestId
  }

  /**
   * The path to print representation of the figure for use in EPUB & PDF
   */
  get printImage() {
    if (!this.isExternalResource && this.src && !this.data.printImage) {
      const { ext, name } = path.parse(this.src)
      return path.join('/', this.outputDir, name, `print-image${ext}`)
    }
    return this.data.printImage
  }

  /**
   * The figure region to display on load
   * @return {String} format "x,y,width,height" Defaults to full dimensions
   */
  get region() {
    if (this.isExternal) return
    return this.data.region || `0,0,${this.canvasWidth},${this.canvasHeight}`
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
      isCanvas: this.isCanvas,
      isImageService: this.isImageService,
      label: this.label,
      manifestId: this.manifestId,
      mediaId: this.mediaId,
      mediaType: this.mediaType,
      printImage: this.printImage,
      region: this.region,
      src: this.src
    }
  }

  /**
   * Get the width and height of the canvas
   */
  async calcCanvasDimensions() {
    if (!this.canvasImagePath) return
    const { height, width } = await sharp(this.canvasImagePath).metadata()
    this.canvasHeight = height
    this.canvasWidth = width
  }

  /**
   * Call file process methods and return errors
   * 
   * @return {Object}
   * @property {Array} errors
   */
  async processFiles() {
    this.errors = []

    if (this.isExternalResource) return {}

    await this.calcCanvasDimensions()
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
    if (!this.isCanvas || !this.src) return
    const { transformations } = this.iiifConfig
    const { errors } = await this.imageProcessor.processImage(this.src, this.outputDir, {
      tile: true,
      transformations
    })
    if (errors) this.errors = this.errors.concat(errors)
  }

  /**
   * Create IIIF `manifest.json` file
   */
  async processManifest() {  
    if (!this.isCanvas) return
    const manifest = new Manifest(this)
    const jsonResponse = await manifest.toJSON()
    if (jsonResponse.errors) this.errors = this.errors.concat(jsonResponse.errors)
    const writeResponse = await manifest.write()
    if (writeResponse.errors) this.errors = this.errors.concat(writeResponse.errors)
  }
}
