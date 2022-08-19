const Base = require('./base')
const path = require('path')
const titleCase = require('~plugins/filters/titleCase')

module.exports = class AnnotationBase extends Base {
  constructor(data, canvas, body) {
    super(data, canvas, body)

    this.canvas = canvas
    this.item = !Array.isArray(body) ? body : null
    this.items = Array.isArray(body) ? body : null
    this.type = 'Annotation'
  }

  create() {
    return {
      body: this.body,
      id: this.id,
      motivation: this.motivation,
      type: this.type
    }
  }

  getFileName(item) {
    if (!item.src) return
    return path.parse(item.src).name
  }

  getLabel(item) {
    return item.label || titleCase(this.getFilename(item))
  }
}
