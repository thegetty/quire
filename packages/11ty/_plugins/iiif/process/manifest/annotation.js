const AnnotationBase = require('./annotation-base')
const path = require('path')
const titleCase = require('~plugins/filters/titleCase')

module.exports = class Annotation extends AnnotationBase {
  constructor(eleventyConfig, canvas, item) {
    super(eleventyConfig, canvas)

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
    this.item = item
    this.motivation = motivation
  }
}
