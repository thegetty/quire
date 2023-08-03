const chalkFactory = require('~lib/chalk')
const mime = require('mime-types')
const path = require('path')
const titleCase = require('~plugins/filters/titleCase')

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
module.exports = class Annotation {
  constructor(figure, data) {
    const { iiifConfig, outputDir, zoom } = figure
    const { baseURI, tilesDirName } = iiifConfig
    const { label, region, selected, src, text } = data
    const { base, ext, name } = src ? path.parse(src) : {}

    /**
     * If an id is not provided, compute id from the `label` or `src` properties
     * @return {String}
     */
    const id = () => {
      switch(true) {
        case !!data.id:
          return data.id
        case !!src:
          return name
        case !!label:
          return label.split(' ').join('-').toLowerCase()
        default:
          logger.error(`Unable to set an id for annotation. Annotations must have an 'id', 'label', or 'src' property.`)
          return
      }
    }

    /**
     * Create image service for annotation image if it is a JPG and
     * the figure has zoom enabled
     *
     * Note: Currently only JPG image services are supported by
     * canvas-panel/image-service tags
     */
    const isImageService = !!zoom && ext === '.jpg'
    const info = () => {
      if (!isImageService) return
      const tilesPath = path.join(outputDir, name, tilesDirName)
      const infoPath = path.join(tilesPath, 'info.json')
      return new URL(path.join(baseURI, infoPath)).toString()
    }

    const uri = () => {
      const filepath = isImageService
        ? info()
        : path.join(outputDir, base)
      return new URL(path.join(baseURI, filepath)).toString()
    }

    this.format = text && !src ? 'text/plain' : mime.lookup(src)
    this.id = id()
    this.info = info()
    this.isImageService = isImageService
    this.label = label || titleCase(path.parse(src).name)
    this.motivation = src ? 'painting' : 'text'
    this.selected = selected
    this.src = src
    this.region = region
    this.text = text
    this.type = figure.src || region || text ? 'annotation' : 'choice'
    this.uri = uri()
  }
}
