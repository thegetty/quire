import { isCanvas, isImageService, isSequence } from '../helpers/index.js'
import Annotation from '../annotation/index.js'
import AnnotationFactory from '../annotation/factory.js'
import Fetch from '@11ty/eleventy-fetch'
import Manifest from '../iiif/manifest/index.js'
import SequenceFactory from '../sequence/factory.js'
import chalkFactory from '#lib/chalk/index.js'
import path from 'node:path'
import sharp from 'sharp'
import slugify from '@sindresorhus/slugify'
import urlPathJoin from '#lib/urlPathJoin/index.js'

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
export default class Figure {
  constructor (iiifConfig, imageProcessor, data) {
    const { baseURI, dirs, manifestFileName } = iiifConfig
    const outputDir = path.join(dirs.outputPath, data.id)
    const outputPathname = path.posix.join(dirs.outputPath, data.id)

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

        case data.iiif_image && iiifConfig.hostExternal:
          try {
            const terminated = data.iiif_image.endsWith('/') ? data.iiif_image : data.iiif_image + '/'
            const full = 'full/full/0/default.jpg'

            const fullUrl = new URL(full, terminated)
            return fullUrl.href
          } catch (error) {
            logger.error(`Erorr creating canvas id. The IIIF Image API URL ${data.iiif_image} did not create a fully qualified URL`)
            return
          }
        case data.iiif_image && !iiifConfig.hostExternal:
          try {
            return urlPathJoin(baseURI, slugify(data.iiif_image), 'canvas')
          } catch (error) {
            logger.error(`Error creating canvas id. The baseURI (${baseURI}) and the slugged IIIF Image URL (${slugify(data.iiif_image)}) are invalid to form a fully qualified URI.`)
            return
          }

        default:
          try {
            return urlPathJoin(baseURI, outputPathname, 'canvas')
          } catch (error) {
            logger.error(`Error creating canvas id. Either the output directory (${outputPathname}) or base URI (${baseURI}) are invalid to form a fully qualified URI.`)
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
            return urlPathJoin(baseURI, outputPathname, manifestFileName)
          } catch (error) {
            logger.error(`Error creating manifest id. Either the output directory (${outputPathname}), filename (${manifestFileName}), or base URI (${baseURI}) are invalid to form a fully qualified URI.`)
          }
      }
    }

    const defaults = {
      mediaType: 'image'
    }

    const {
      id,
      iiif_image: iiifImage,
      label,
      media_id: mediaId,
      media_type: mediaType,
      src,
      zoom
    } = data

    let ext
    switch (true) {
      case (!!iiifImage):
        ext = '.jpg'
        break
      case (!!src):
        ext = path.parse(src).ext
        break
      default:
        ext = null
    }

    const format = iiifConfig.formats.find(({ input }) => input.includes(ext))

    this.annotationCount = data.annotations ? data.annotations.length : 0
    this.canvasId = canvasId()
    this.data = data
    this.id = id
    this.iiifConfig = iiifConfig
    this.iiifImage = iiifImage
    this.isCanvas = isCanvas(data)
    this.isImageService = isImageService(data)
    this.isSequence = isSequence(data)
    this.label = label
    this.manifestId = manifestId()
    this.mediaType = mediaType || defaults.mediaType
    this.mediaId = mediaId
    this.outputDir = outputDir
    this.outputPathname = outputPathname
    this.outputFormat = format && format.output
    this.processImage = imageProcessor
    this.src = src
    /**
     * We are disabling zoom for all sequence figures
     * our custom image-sequence component currently only supports static images
     */
    this.zoom = isSequence(data) ? false : zoom

    // NB: *Factory depend on props of `this` so Object.assign() breaks circularity
    this.annotationFactory = new AnnotationFactory(Object.assign({}, this))
    this.sequenceFactory = new SequenceFactory(Object.assign({}, this))
  }

  /**
   * Figure image annotations
   * @type  {Array<Annotations>}
   */
  get annotations () {
    return this.annotationFactory.create()
  }

  /**
   * Figure image sequence
   * @type  {Array<Sequence>}
   */
  get sequences () {
    return this.sequenceFactory.create()
  }

  /**
   * When the figure is a canvas, create an annotation for this
   * `src` or `iiif_image` as an annotation for use in IIIF manifests.
   *
   * @return {Annotation|null}
   */
  get baseImageAnnotation () {
    const { label, src } = this.data

    switch (true) {
      case (src && this.isCanvas):
      case (this.iiifImage && this.isCanvas):
        return new Annotation(this, { label, src })
      default:
        return null
    }
  }

  /**
   * Path to the image file that represents the canvas
   * Used to define canvas properties `width` and `height`
   */
  get canvasImagePath () {
    if (!this.isCanvas) return

    if (this.iiifImage) return this.iiifImage

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
  get isExternalResource () {
    const url = /^https?:\/\//
    return (this.src && url.test(this.src)) ||
            this.data.manifestId ||
            (this.iiifImage && !this.iiifConfig.hostExternal)
  }

  /**
   * Path to a print representation of the figure for EPUB & PDF outputs
   * @type {String}
   */
  get printImage () {
    if (this.data.printImage) return this.data.printImage

    let name
    switch (true) {
      // IIIF Images that are external return a print-width'd resource
      case (this.iiifImage && this.isExternalResource):{
        const terminated = this.iiifImage.endsWith('/') ? this.iiifImage : this.iiifImage + '/'
        const printSized = 'full/2025,/0/default.jpg'

        const url = new URL(printSized, terminated)
        return url.href
      }
      // CDN / external images are passed as-is
      case (this.src && this.isExternalResource):
        return this.src

      // Image files and hosted ext. IIIF images serve a transform-created image
      case (this.iiifImage && !this.isExternalResource):
      case (this.src && !this.isExternalResource):
        if (this.iiifImage) {
          name = slugify(this.iiifImage)
        } else {
          ({ name } = path.parse(this.src))
        }
        return path.posix.join('/', this.outputPathname, name, `print-image${this.outputFormat}`)

      default:
        return undefined
    }
  }

  /**
   * The figure region to display on load
   * @return {String} format "x,y,width,height" Defaults to full dimensions
   */
  get region () {
    if (this.isExternal || this.mediaType !== 'image') return
    return this.data.region || `0,0,${this.canvasWidth},${this.canvasHeight}`
  }

  /**
   * Path to a static representation of the figure for inline display
   * @type {String}
   */
  get staticInlineFigureImage () {
    switch (true) {
      case (this.src && this.mediaType !== 'table'):
      case (this.sequences && this.mediaType !== 'table'): {
        let filename
        if (this.src) {
          filename = this.src
        } else {
          const sequenceStart = this.sequences[0].start
          filename = sequenceStart || this.sequences[0].files[0]
        }

        const { ext, name } = path.parse(filename)
        const format = this.iiifConfig.formats.find(({ input }) => input.includes(ext))

        return path.posix.join('/', this.outputPathname, name, `static-inline-figure-image${format.output}`)
      }
      case (this.iiifImage && !this.isExternalResource):
        return path.posix.join('/', this.outputPathname, slugify(this.iiifImage), 'static-inline-figure-image.jpg')

      case (this.src && this.isExternalResource):
        return this.src

      case (this.iiifImage && this.isExternalResource): {
        const terminated = this.iiifImage.endsWith('/') ? this.iiifImage : this.iiifImage + '/'
        const inlineSize = 'full/600,/0/default.jpg'

        const url = new URL(inlineSize, terminated)
        return url.href
      }

      default:
        return this.data.staticInlineFigure
    }
  }

  /**
   * Return only the data properties consumed by quire shortcodes
   * @return {Object} figure
   */
  adapter () {
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
      iiifImage: this.iiifImage,
      isCanvas: this.isCanvas,
      isExternalResource: this.isExternalResource,
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
  async calcCanvasDimensions () {
    if (!this.canvasImagePath || (this.iiifImage && !this.isCanvas)) return

    let height, width

    // Fetch dimensions from IIIF via `Fetch` or the disk via `sharp`
    if (this.iiifImage) {
      // TODO: Move `try` to outer scope!! can't sharp().metadata() also throw?
      try {
        const terminatedUrl = this.iiifImage.endsWith('/') ? this.iiifImage : this.iiifImage + '/'

        const infoUrl = new URL('info.json', terminatedUrl)
        const info = await Fetch(infoUrl.href, { type: 'json' })

        height = info.height
        width = info.width
      } catch (err) {
        logger.error(`Could not fetch metadata for figure ${this.id} with error ${err}!`)
        return
      }
    } else {
      ({ height, width } = await sharp(this.canvasImagePath).metadata())
    }

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
  async processFiles () {
    this.errors = []

    if (this.isExternalResource && !this.iiifImage) return {}

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
  async processAnnotationImages () {
    // TODO Consider refactor - `this.annotations` creates new instances of AnnotationFactory on each call, `validateImageForTiling` is a no-op against its passed arg
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
  async processFigureImage () {
    if (!this.isCanvas) return
    if (!(this.src || this.iiifImage)) return
    if (this.isExternalResource) return

    const { transformations } = this.iiifConfig

    this.validateImageForTiling()
    const processSrc = this.src ?? this.iiifImage
    const { errors } = await this.processImage(processSrc, this.outputDir, {
      tile: true,
      iiifEndpoint: !!this.iiifImage,
      transformations
    })

    if (errors) this.errors = this.errors.concat(errors)
  }

  async processFigureSequence () {
    // TODO Consider refactor - any time `this.sequences` is referenced, it creates a new instance of SequenceFactory
    if (!this.sequences) return

    const { transformations } = this.iiifConfig
    const [sequenceStartFilename] = this.sequences.flatMap(({ files, start }) => {
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
   *
   * TODO: This check can almost certainly be removed now that the base canvas uses .jpg
   */
  validateImageForTiling (src) {
    const minLength = this.iiifConfig.tileSize * 2

    this.dimensionsValidForTiling = this.canvasWidth > minLength && this.canvasHeight > minLength

    if (!this.dimensionsValidForTiling) {
      logger.error(`Unable to create a zooming image from "${this.src ? path.parse(this.src).base : this.iiifImage}". Images under ${minLength}px will not display unless zoom is set to false.`)
    }
  }

  /**
   * Create the IIIF `manifest.json` for <canvas-panel> components,
   * collect errors from calling toJSON and the file system writer.
   */
  async createManifest () {
    if (!this.isCanvas) return

    const manifest = new Manifest(this)
    const { errors } = await manifest.write()

    if (errors) this.errors = this.errors.concat(errors)
  }
}
