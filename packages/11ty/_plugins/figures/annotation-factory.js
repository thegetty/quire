const chalkFactory = require('~lib/chalk')
const path = require('path')
const titleCase = require('~plugins/filters/titleCase')
const { error } = chalkFactory('Figure Processing:IIIF:Annotations')

/**
 * Quire Annotation
 */
module.exports = class AnnotationFactory {
  constructor(iiifConfig) {
    this.iiifConfig = iiifConfig
  }

  create(figure, data) {
    /**
     * If an id is not provided, compute id from the `label` or `src` properties
     * @return {String}
     */
    const id = () => {
      switch(true) {
        case !!data.id:
          return data.id
        case !!data.src:
          return path.parse(data.src).name
          break;
        case !!data.label:
          return data.label.split(' ').join('-').toLowerCase()
          break;
        default:
          error(`Error setting ID for annotation on figure "${figure.id}". Annotations must have a 'label' or 'src' property.`)
          break;
      }
    }

    /**
     * Filepath is the input path OR the path to a `tiles` directory 
     * if the image is an image service (figure.preset === 'zoom')
     * @return {String}
     */
    const filepath = () => {
      return figure.preset === "zoom"
        ? [
            this.iiifConfig.outputDir,
            data.id,
            this.iiifConfig.imageServiceDirectory,
          ].join('/')
        : [this.iiifConfig.inputDir, data.src].join('/');
    }

    /**
     * The URL where the annotation resource is served
     * @return {String}
     */
    const url = () => {
      return new URL(filepath(), process.env.URL).href
    }

    return {
      id: id(),
      label: data.label || titleCase(path.parse(data.src).name),
      motivation: data.src ? 'painting' : 'text',
      type: figure.src || data.target || data.text ? 'annotation' : 'choice',
      url: url(),
      ...data
    }
  }
}
