const AnnotationBase = require('./annotation-base')
const path = require('path')
const titleCase = require('~plugins/filters/titleCase')

module.exports = class Annotation extends AnnotationBase {
  constructor(data, canvas, item) {
    super(data, canvas, item)

    let motivation
    switch(true) {
      case !!item.src:
        motivation = 'painting'
        break
      case !!item.text:
        motivation = 'text'
        break
      default:
        console.error(`boo`)
        break;
    }

    this.id = [this.canvas.id, 'annotation', item.id].join('/')
    this.motivation = motivation
  }
}
