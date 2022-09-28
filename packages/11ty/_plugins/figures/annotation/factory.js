const chalkFactory = require('~lib/chalk')
const ImageFactory = require('../image/factory')
const mime = require('mime-types')
const path = require('path')
const titleCase = require('~plugins/filters/titleCase')
const logger = chalkFactory('Figure Processing:IIIF:Annotations')

/**
 * Quire Figure Annotations conform to the W3C Web Annotation Format
 * @see {@link https://www.w3.org/TR/annotation-model/#annotations}
 */
module.exports = class AnnotationFactory {
  constructor(iiifConfig) {
    this.iiifConfig = iiifConfig
    this.imageFactory = new ImageFactory(iiifConfig)
  }

  /**
   * @param  {Figure} figure
   * @param  {Object} data Annotation item data defined on a figure in `figures.yaml`
   * @property {String} id Annotation id
   * @property {String} label Annotation label
   * @property {String} src Path to annotation image src
   * 
   * @typedef {Object} Annotation
   * @property {String} id
   * @property {String} format The annotation resource's media type
   * @property {String} label The label rendered in the UI to select an annotation
   * @property {String} motivation
   * @property {String} url The url for the annotation resource
   * 
   * @return {Annotation}
   */
  async create({ annotation, figure }) {
    const { baseURL, dirs } = this.iiifConfig
    const { src } = annotation
    const outputDir = path.join(this.iiifConfig.dirs.output, figure.id)

    /**
     * Note: Currently only JPG image services are supported by canvas-panel/image-service tags
     */
    const { ext } = src ? path.parse(src) : {}
    const isImageService = !!figure.zoom && ext === '.jpg'

    /**
     * If an id is not provided, compute id from the `label` or `src` properties
     * @return {String}
     */
    const id = () => {
      switch(true) {
        case !!annotation.id:
          return annotation.id
        case !!src:
          return path.parse(src).name
          break;
        case !!annotation.label:
          return annotation.label.split(' ').join('-').toLowerCase()
          break;
        default:
          logger.error(`Unable to set an id for annotation on figure "${figure.id}". Annotations must have an 'id', 'label', or 'src' property.`)
          break;
      }
    }

    /**
     * Filepath is the input path OR the path to a `tiles` directory 
     * if the image is an image service (figure.zoom === true)
     * @return {String}
     */
    const filepath = () => {
      const { base } = path.parse(src)
      return isImageService
        ? [
            dirs.output,
            id(),
            dirs.imageService,
          ].join('/')
        : path.join(outputDir, base)
    }

    /**
     * Media-type of the annotation resource
     * @return {String}
     */
    const format = () => {
      return annotation.text && !src ? 'text/plain' : mime.lookup(src)
    }

    /**
     * The URL where the annotation resource is served
     * @return {String}
     */
    const url = () => {
      return new URL(filepath(), baseURL).href
    }

    const { info } = await this.imageFactory.process(
      {
        outputDir,
        src
      },
      { tile: isImageService }
    )

    return {
      id: id(),
      info,
      isImageService,
      format: format(),
      label: annotation.label || titleCase(path.parse(src).name),
      motivation: src ? 'painting' : 'text',
      type: figure.src || annotation.target || annotation.text ? 'annotation' : 'choice',
      url: url(),
      ...annotation
    }
  }
}
