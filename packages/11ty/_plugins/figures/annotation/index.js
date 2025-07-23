import chalkFactory from '#lib/chalk/index.js'
import mime from 'mime-types'
import path from 'node:path'
import titleCase from '#plugins/filters/titleCase.js'
import urlPathJoin from '#lib/urlPathJoin/index.js'
import slugify from '@sindresorhus/slugify'

const logger = chalkFactory('Figures:Annotation')

/**
 * Quire Figure Annotations conform to the W3C Web Annotation Format
 * @see {@link https://www.w3.org/TR/annotation-model/#annotations}
 *
 * @typedef {Object} Annotation
 * @property {String} format  The media type of the annotation resource
 * @property {String} id  The unique id of the annotation (unique to the figure)
 * @property {String} info  The path to the `info.json` if annotation is an image service
 * @property {Boolean} isImageService  True if the resource is an image service
 * @property {String} label  The label rendered in the UI to select an annotation
 * @property {String} motivation W3C motivation property
 * @property {String} src  The path to the original image
 * @property {String} region  The region on the canvas where the annotation is applied
 * @property {String} text  The body of a text annotation
 * @property {String} type  Annotation type, "choice" or "annotation"
 * @property {String} uri  URI for the annotation resource
 *
 * @return {Annotation}
 */
export default class Annotation {
  constructor (figure, data) {
    const {
      annotationCount,
      iiifConfig,
      iiifImage,
      isExternalResource,
      outputDir,
      outputFormat,
      printImage,
      src: figureSrc,
      zoom
    } = figure
    const { baseURI, tilesDirName } = iiifConfig
    const { label, region, selected, src, text } = data

    let base, name
    switch (true) {
      case (!!src):
        ({ base, name } = path.parse(src))
        break
      case (!!iiifImage):
        name = slugify(iiifImage)
        break
    }

    /**
     * If an id is not provided, compute id from the `label` or `src` properties
     * @return {String}
     */
    const id = () => {
      switch (true) {
        case !!data.id:
          return data.id
        case !!src:
          return name
        case !!iiifImage:
          return slugify(iiifImage)
        case !!label:
          return label.split(' ').join('-').toLowerCase()
        default:
          logger.error('Unable to set an id for annotation. Annotations must have an \'id\', \'label\', or \'src\' property.')
      }
    }

    /**
     * Create image service for annotation image if it is a JPG and
     * the figure has zoom enabled
     *
     * Note: Currently tiling is only supported for the figure.src, not annotations
     *
     * Note: Currently only JPG image services are supported by
     * canvas-panel/image-service tags
     */
    const isImageService =
      !!zoom &&
      outputFormat === '.jpg' &&
      (annotationCount === 0 || src === figureSrc || iiifImage)

    const info = () => {
      if (!isImageService) return

      if (iiifImage && isExternalResource) {
        return urlPathJoin(iiifImage, 'info.json')
      }

      // NB: Joining by posix because will become URLs
      const tilesPath = path.posix.join(outputDir, name, tilesDirName)
      const infoPath = path.posix.join(tilesPath, 'info.json')

      try {
        return urlPathJoin(baseURI, infoPath)
      } catch (error) {
        logger.error(`Error creating info.json. Either the tile path (${tilesPath}) or base URI (${baseURI}) are invalid to form a fully qualified URI.`)
      }
    }

    const uri = () => {
      switch (true) {
        case isImageService && isExternalResource:
          return urlPathJoin(iiifImage, 'full', 'full', '0', 'default.jpg')
        case isImageService && !isExternalResource:
          // NB: Annotations for imageServices are *jpeg*s not the service endpoint
          return urlPathJoin(baseURI, printImage)
        default:
          try {
            return urlPathJoin(baseURI, outputDir, base)
          } catch (error) {
            logger.error(`Error creating annotation URI. Either the output directory (${outputDir}), filename (${base}) or base URI (${baseURI}) are invalid to form a fully qualified URI.`)
          }
      }
    }

    let format
    switch (true) {
      case (!!iiifImage):
        format = 'image/jpeg'
        break
      case (text && !src):
        format = 'text/plain'
        break
      default:
        format = mime.lookup(src)
    }

    this.format = format
    this.id = id()
    this.info = info()
    this.isImageService = isImageService
    this.label = label || titleCase(src ? path.parse(src).name : figure.id)
    this.motivation = src ? 'painting' : 'text'
    this.selected = selected
    this.src = src
    this.region = region
    this.text = text
    this.type = figureSrc || region || text ? 'annotation' : 'choice'
    this.uri = uri()
  }
}
