const chalkFactory = require('~lib/chalk')
const mime = require('mime-types')
const path = require('path')
const titleCase = require('~plugins/filters/titleCase')

const logger = chalkFactory('Figures:SequenceItem')

/**
 * Quire Figure Sequence Items conform to the W3C Web Annotation Format
 * @see {@link https://www.w3.org/TR/annotation-model/#annotations}
 *
 * SequenceItem is a single slice of a figure sequence and provides all of the data necessary to create an annotation for that slice
 *
 * @typedef {Object} SequenceItem
 * @property {String} format           The media type of the annotation resource
 * @property {String} id               The unique id of the annotation (unique to the figure)
 * @property {String} info             The path to the `info.json` if annotation is an image service
 * @property {Boolean} isImageService  True if the resource is an image service
 * @property {String} label            The label rendered in the UI to select an annotation
 * @property {String} motivation       W3C motivation property
 * @property {String} src              The path to the original image
 * @property {String} type             Annotation type, "choice"
 * @property {String} uri              URI for the annotation resource
 *
 * @return {Annotation}
 */
module.exports = class SequenceItem {
  constructor(figure, data) {
    const { iiifConfig, outputDir } = figure
    const { annotations, label, src } = data
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
     * Create image service for sequence item image if it is a JPG and
     * the figure has zoom enabled
     *
     * Note: Currently only JPG image services are supported by
     * canvas-panel/image-service tags
     */
    const isImageService = !!figure.data.zoom && ext === '.jpg'
    const info = () => {
      if (!isImageService) return
      const tilesPath = path.join(outputDir, name, iiifConfig.tilesDirName)
      const infoPath = path.join(tilesPath, 'info.json')
      return new URL(infoPath, iiifConfig.baseURI).toString()
    }

    const uri = () => {
      const filepath = isImageService
        ? info()
        : path.join(outputDir, base)
      return new URL(filepath, iiifConfig.baseURI).toString()
    }

    this.annotations = annotations
    this.format = mime.lookup(src)
    this.id = id()
    this.info = info()
    this.isImageService = isImageService
    this.label = label || titleCase(path.parse(src).name)
    this.motivation = 'painting'
    this.src = src
    this.type = 'annotation'
    this.uri = uri()
  }
}
