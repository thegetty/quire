const chalkFactory = require('~lib/chalk')
const path = require('path')
const { error } = chalkFactory('Figure Processing:IIIF:Annotations')

/**
 * Quire Annotation
 */
module.exports = class Annotation {
  constructor(eleventyConfig, figure, data) {
    this.data = data
    this.iiifConfig = eleventyConfig.globalData.iiifConfig
    this.figure = figure
    this.type = data.target || data.text ? 'annotation' : 'choice'
    this.src = data.src
  }

  get filepath() {
    return this.figure.preset === "zoom"
      ? [
          this.iiifConfig.outputDir,
          this.id,
          this.iiifConfig.imageServiceDirectory,
        ].join('/')
      : [this.iiifConfig.inputDir, this.src].join('/');
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

  get label() {
    const { label, src } = this.data
    switch(true) {
      case !!label:
        return label
        break;
      case !!src:
        return titleCase(path.parse(src).name)
        break;
      default:
        error(`Error setting label for annotation on figure "${this.figure.id}". Annotations must have a 'label' or 'src' property.`)
        break;
    }
  }

  get motivation() {
    switch(true) {
      case this.text:
        return 'text'
        break;
      case this.src:
        return 'painting'
        break;
      default:
        error(`Error setting label for annotation on figure "${this.figure.id}". Annotations must have a 'text' or 'src' property.`)
        break;
    }
  }

  get url() {
    return new URL(this.filepath, process.env.URL).href
  }
}
