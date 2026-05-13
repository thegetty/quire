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

const logger = chalkFactory('Figures:FigureMedia', 'DEBUG')

/**
 * @param {Object} iiifConfig
 * @param {Function} processImage  Function to generate IIIF assets
 * @param {Object} data  Figure data from and entry in `figures.yaml`
 *
 * @typedef {Object} FigureMedia
 * @property {Array<AnnotationSet>} annotations
 * @property {String} canvasId ID of IIIF canvas
 * @property {Boolean} isCanvas True if figure contains a canvas resource
 * @property {Boolean} isExternalResource True if figure references an externally hosted resource
 * @property {Boolean} isImageService True if figure contains an image service resource
 * @property {String} manifestId ID of IIIF manifest
 * @property {String} printImage Optional path to an alternate image to use in print
 */
export default class FigureMedia {
  constructor (iiifConfig, imageProcessor, data) {
    const { baseURI, debugLog, dirs, manifestFileName } = iiifConfig
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
    this.debugLog = debugLog
    this.id = id
    this.iiifConfig = iiifConfig
    this.iiifImage = iiifImage
    this.isCanvas = isCanvas(data)
    this.isImageService = isImageService(data)
    this.isSequence = isSequence(data)
    this.label = label
    this.manifestId = manifestId()
    this.mediaType = mediaType || 'image'
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
   * FigureMedia image annotations
   * @type  {Array<Annotations>}
   */
  get annotations () {
    return this.annotationFactory.create()
  }

  /**
   * FigureMedia image sequence
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
   * Path to the image file on disk, or the image of the first choice or sequence image.
   */
  get imageFilePath () {
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
    return this.data.region || `0,0,${this.width},${this.height}`
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
   * Return media data for this figure for use by quire shortcodes
   *
   * @return {Object} figure
   */
  media () {
    /**
     * Set canvas index to the first canvas of the first sequence
     */
    const startCanvasIndex = this.isSequence ? this.sequences[0].startCanvasIndex : null

    return {
      ...this.data,
      annotations: this.annotations,
      canvasId: this.canvasId,
      dimensions: this.dimensions,
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
      thumbnail: this.staticInlineFigureImage,
      transformations: this.transformations
    }
  }

  /**
   * @function calculateDimensions
   *
   * Reads and stores this figure's height and width
   *
   **/
  async calculateDimensions () {
    let height, width

    // Fetch dimensions from IIIF via `Fetch` or the disk via `sharp`
    if (this.iiifImage) {
      try {
        const terminatedUrl = this.iiifImage.endsWith('/') ? this.iiifImage : this.iiifImage + '/'

        const infoUrl = new URL('info.json', terminatedUrl)
        const info = await Fetch(infoUrl.href, { type: 'json' })

        height = info.height
        width = info.width
      } catch (error) {
        logger.error(`Could not fetch metadata for figure ${this.id} with error ${error}!`)
        return
      }
    } else {
      try {
        ({ height, width } = await sharp(this.imageFilePath).metadata())
      } catch (error) {
        logger.error(`Could not read metadata for figure ${this.id}: ${error}!`)
        return
      }
    }

    this.height = height
    this.width = width
  }

  /**
   * @function processFigure
   *
   * Processes figure metadata and asset files into servable assets
   *
   * @return {Object}
   * @property {Array} errors
   *
   */
  async processFigure () {
    this.errors = []

    if (this.mediaType !== 'image') return {}
    if (this.isExternalResource && !this.iiifImage) return {}

    await this.calculateDimensions()

    await this.processAnnotationImages()

    if (this.isSequence) {
      await this.processFigureSequence()
    } else {
      await this.processFigureImage()
    }

    if (this.isCanvas) {
      await this.createManifest()
    }

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
      if (this.debugLog) logger.debug(`processing annotation image ${item.src}`)
      if (item.isImageService) this.validateImageForTiling(item.src)
      return item.src && this.processImage(item.src, this.outputDir, {
        tile: item.isImageService
      })
    }))
    const errors = results.flatMap(({ errors }) => errors || [])
    if (errors.length) this.errors = this.errors.concat(errors)
  }

  /**
   * @function convertSnakeCase
   *
   * @param {string} content
   *
   * @returns {string}
   *
   * Converts a string in snake-case to camelCase
   *
   **/
  convertSnakeCase (content) {
    const parts = content.split('-')
    const capitalized = parts.map((part, i) => {
      const first = i > 0 ? part.charAt(0).toUpperCase() : part.charAt(0)

      return (first + part.substring(1))
    })

    return capitalized.join('')
  }

  /**
   * @function storeTransformResult
   *
   * @param {string} name
   * @param {Object} metadata
   * @param {null|string} filename
   *
   * Stores image paths + metadata for a transformation under the key `name`.
   * Uses `filename` in paths if non-null.
   *
   **/
  storeTransformResult (name, metadata, filename = null) {
    if (typeof this.transformations !== 'object') {
      this.transformations = {}
    }

    const { baseURI } = this.iiifConfig
    const { pathname } = new URL(baseURI)

    const { height, width } = metadata

    let paths = {}

    // Ensure the path is passed unmutated if a URL
    if (this.isExternalResource) {
      paths = { absolute: this.src, internal: this.src, uri: this.src }
    } else {
      filename ??= `${name}.jpg`
      const { name: directory } = path.parse(this.src)

      // NB: Internal must absolute relative to publication root!
      const internal = path.join('/', this.outputPathname, directory, filename)
      const absolute = path.join(pathname, internal)
      const uri = urlPathJoin(baseURI, internal)

      paths = {
        absolute,
        internal,
        uri
      }
    }

    const property = this.convertSnakeCase(name)
    this.transformations[property] = {
      dimensions: {
        height,
        width
      },
      paths
    }
  }

  /**
   * @function processFigureImage
   *
   * Tiles and transforms `src` asset
   *
   */
  async processFigureImage () {
    if (!(this.src || this.iiifImage)) return
    if (this.isExternalResource) return

    const { transformations } = this.iiifConfig

    const options = {
      transformations
    }

    if (this.isCanvas) {
      this.validateImageForTiling()

      options.iiifEndpoint = Boolean(this.iiifImage)
      options.tile = true
    }

    const processSrc = this.src ?? this.iiifImage
    const { errors, metadata } = await this.processImage(processSrc, this.outputDir, options)

    if (errors) this.errors = this.errors.concat(errors)

    // Store path and dimensions data for the full resolution and all transformations
    const { base: filename } = path.parse(this.src)
    this.storeTransformResult('full', { height: this.height, width: this.width }, filename)

    for (const [name, result] of Object.entries(metadata ?? {})) {
      this.storeTransformResult(name, result)
    }
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
      if (this.debugLog) logger.debug(`processing sequence image ${item.src}`)
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

    this.dimensionsValidForTiling = this.width > minLength && this.height > minLength

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
