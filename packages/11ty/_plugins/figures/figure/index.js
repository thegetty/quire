const chalkFactory = require('~lib/chalk')
const Annotation = require('../annotation')
const AnnotationFactory = require('../annotation/factory')
const Manifest = require('../iiif/manifest')
const path = require('path')
const SequenceFactory = require('../sequence/factory')
const sharp = require('sharp')
const {
  isCanvas,
  isImageService,
  isSequence
} = require('../helpers')

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
    const canvasId = () => {
      switch (true) {
        case !isCanvas(data):
          return
        case !!data.canvasId:
          return data.canvasId
        default:
          try {
            return new URL(path.join(outputDir, 'canvas'), baseURI).href
          } catch (error) {
            logger.error(`Error creating canvas id. Either the output directory (${outputDir}) or base URI (${baseURI}) are invalid to form a fully qualified URI.`)
            return
          }
      }
    }

    /**
     * URI of the IIIF manifest file; a fully qualified URL.
     * @type  {URL|null}
     */
    const manifestId = () => {
      switch (true) {
        case !isCanvas(data):
          return
        case !!data.manifestId:
          return data.manifestId
        default:
          try {
            return new URL(path.join(outputDir, manifestFileName), baseURI).href
          } catch (error) {
            logger.error(`Error creating manifest id. Either the output directory (${outputDir}), filename (${manifestFileName}), or base URI (${baseURI}) are invalid to form a fully qualified URI.`)
            return
          }
      }
    }

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

    const ext = src ? path.parse(src).ext : null
    const format = iiifConfig.formats.find(({ input }) => input.includes(ext))

    this.annotationCount = data.annotations ? data.annotations.length : 0
    this.annotationFactory = new AnnotationFactory(this)
    this.canvasId = canvasId()
    this.data = data
    this.id = id
    this.iiifConfig = iiifConfig
    this.isCanvas = isCanvas(data)
    this.isImageService = isImageService(data)
    this.isSequence = isSequence(data)
    this.label = label
    this.manifestId = manifestId()
    this.mediaType = mediaType || defaults.mediaType
    this.mediaId = mediaId
    this.outputDir = outputDir
    this.outputFormat = format && format.output
    this.processImage = imageProcessor
    this.sequenceFactory = new SequenceFactory(this)
    this.src = src
    /**
     * We are disabling zoom for all sequence figures
     * our custom image-sequence component currently only supports static images
     */
    this.zoom = isSequence(data) ? false : zoom
  }

  /**
   * Figure image annotations
   * @type  {Array<Annotations>}
   */
  get annotations() {
    return this.annotationFactory.create()
  }

  /**
   * Figure image sequence
   * @type  {Array<Sequence>}
   */
  get sequences() {
    return this.sequenceFactory.create()
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
        .find(({ region }) => !region)
      if (!firstChoice) return
      return firstChoice.src
    }
    const firstSequenceItemSrc = () => {
      if (!this.sequences) return
      const firstSequenceItemDirname = this.sequences[0].dir
      const firstSequenceItemFilename = this.sequences[0].files[0]
      return path.join(firstSequenceItemDirname, firstSequenceItemFilename)
    }
    const imagePath = this.src || firstChoiceSrc() || firstSequenceItemSrc()
    if (!imagePath) {
      this.errors.push(`Invalid figure ID "${this.id}". Figures with annotations must have "choice" annotations or a "src" property.`)
      return
    }
    const { imagesDir, inputRoot } = this.iiifConfig.dirs
    return path.join(inputRoot, imagesDir, imagePath)
  }

  /**
   * Test if the `src` is an external resource
   * @return {Boolean}
   */
  get isExternalResource() {
    return (this.src && this.src.startsWith('http')) || this.data.manifestId
  }

  /**
   * Path to a print representation of the figure for EPUB & PDF outputs
   * @type {String}
   */
  get printImage() {
    if (!this.isExternalResource && this.src && !this.data.printImage) {
      const { ext, name } = path.parse(this.src)
      return path.join('/', this.outputDir, name, `print-image${this.outputFormat}`)
    }
    return this.data.printImage
  }

  /**
   * The figure region to display on load
   * @return {String} format "x,y,width,height" Defaults to full dimensions
   */
  get region() {
    if (this.isExternal || this.mediaType !== 'image') return
    return this.data.region || `0,0,${this.canvasWidth},${this.canvasHeight}`
  }

  /**
   * Path to a static representation of the figure for inline display
   * @type {String}
   */
  get staticInlineFigureImage() {
    let filename
    if (this.src) {
      filename = this.src
    } else if (this.sequences) {
      const sequenceStart = this.sequences[0].start
      filename = sequenceStart ? sequenceStart : this.sequences[0].files[0]
    }

    if (!this.isExternalResource && filename && this.mediaType != 'table') {
      const { ext, name } = path.parse(filename)
      const format = this.iiifConfig.formats.find(({ input }) => input.includes(ext))
      return path.join('/', this.outputDir, name, `static-inline-figure-image${format.output}`)
    }
    return this.data.staticInlineFigure
  }

  /**
   * Return only the data properties consumed by quire shortcodes
   * @return {Object} figure
   */
  adapter() {
    /**
     * TODO determine how to handle multiple sequence starting points.
     * Assuming one (the first) sequence for now
     */
    const startCanvasIndex = this.isSequence ? this.sequences[0].startCanvasIndex : null

    return {
      ...this.data,
      annotations: this.annotations,
      canvasId: this.canvasId,
      id: this.id,
      isCanvas: this.isCanvas,
      isImageService: this.isImageService,
      isSequence: this.isSequence,
      label: this.label,
      manifestId: this.manifestId,
      mediaId: this.mediaId,
      mediaType: this.mediaType,
      printImage: this.printImage,
      region: this.region,
      sequences: this.sequences,
      startCanvasIndex,
      src: this.src,
      staticInlineFigureImage: this.staticInlineFigureImage,
      // TODO: implement thumbnail getter
      thumbnail: this.staticInlineFigureImage
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
   * @todo refactor process and create methods to return a response
   * to encapsulate collection of errors into this method.
   *
   * @return {Object}
   * @property {Array} errors
   */
  async processFiles() {
    this.errors = []

    if (this.isExternalResource) return {}

    await this.calcCanvasDimensions()

    await this.processAnnotationImages()

    if (this.isSequence) {
      await this.processFigureSequence()
    } else {
      await this.processFigureImage()
    }

    await this.createManifest()

    return { errors: this.errors }
  }

  /**
   * Process annotation images
   */
  async processAnnotationImages() {
    // TODO Consider refactor - any time `this.annotations` is referenced, it creates a new instance of AnnotationFactory
    if (!this.annotations) return
    const annotationItems = this.annotations.flatMap(({ items }) => items)
    const results = await Promise.all(annotationItems.map((item) => {
      logger.debug(`processing annotation image ${item.src}`)
      if (item.isImageService) this.validateImageForTiling(item.src)
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
    if (!this.isCanvas || !this.src) return
    const { transformations } = this.iiifConfig
    this.validateImageForTiling(this.src)
    const { errors } = await this.processImage(this.src, this.outputDir, {
      tile: true,
      transformations
    })
    if (errors) this.errors = this.errors.concat(errors)
  }

  async processFigureSequence() {
    // TODO Consider refactor - any time `this.sequences` is referenced, it creates a new instance of SequenceFactory
    if (!this.sequences) return
    const { transformations } = this.iiifConfig
    const [ sequenceStartFilename ] = this.sequences.flatMap(({ files, start }) => {
      const { name: firstFileName } = path.parse(files[0])
      return start || firstFileName
    })
    const { name: startId } = sequenceStartFilename ? path.parse(sequenceStartFilename) : {}
    const sequenceItems = this.sequences.flatMap(({ items }) => items)
    const results = await Promise.all(sequenceItems.map((item) => {
      const isStartItem = startId === item.id
      logger.debug(`processing sequence image ${item.src}`)
      return item.src && this.processImage(item.src, this.outputDir, {
        tile: item.isImageService,
        transformations: isStartItem ? transformations : []
      })
    }))
    const errors = results.flatMap(({ errors }) => errors || [])
    if (errors.length) this.errors = this.errors.concat(errors)
  }

  /**
   * Check if image dimensions are valid before proceeding with image processing
   */
  validateImageForTiling(src) {
    const minLength = this.iiifConfig.tileSize * 2

    this.dimensionsValidForTiling = this.canvasWidth > minLength && this.canvasHeight > minLength

    if (!this.dimensionsValidForTiling) {
      logger.error(`Unable to create a zooming image from "${path.parse(src).base}". Images under ${minLength}px will not display unless zoom is set to false.`)
    }
  }

  /**
   * Create the IIIF `manifest.json` for <canvas-panel> components,
   * collect errors from calling toJSON and the file system writer.
   */
  async createManifest() {
    // TODO Figure out why this isn't building properly when `if (!this.isCanvas || !this.isSequence) return`
    if (!this.isCanvas) return
    const manifest = new Manifest(this)
    const { errors } = await manifest.write()
    if (errors) this.errors = this.errors.concat(errors)
  }
}
