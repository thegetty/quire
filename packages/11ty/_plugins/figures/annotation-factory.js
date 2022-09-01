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

  get filepath() {
    return this.figure.preset === "zoom"
      ? [
          this.iiifConfig.outputDir,
          this.data.id,
          this.iiifConfig.imageServiceDirectory,
        ].join('/')
      : [this.iiifConfig.inputDir, this.data.src].join('/');
  }

  get id() {
    const { id, label, src } = this.data
    switch(true) {
      case !!id:
        return id
      case !!label:
        return label.split(' ').join('-').toLowerCase()
        break;
      case !!src:
        return path.parse(src).name
        break;
      default:
        error(`Error setting ID for annotation on figure "${this.figure.id}". Annotations must have a 'label' or 'src' property.`)
        break;
    }
  }

  get url() {
    return new URL(this.filepath, process.env.URL).href
  }

  create(figure, data) {
    this.data = data
    this.figure = figure

    return {
      id: this.id,
      label: data.label || titleCase(path.parse(data.src).name),
      motivation: data.src ? 'painting' : 'text',
      type: figure.src || data.target || data.text ? 'annotation' : 'choice',
      url: this.url,
      ...data
    }
  }
}
