const Annotation = require('./index')

/**
 * The AnnotationFactory creates annotations for a Figure instance
 */
module.exports = class AnnotationFactory {
  /**
   * @param  {Figure} figure
   */
  constructor(figure) {
    this.figure = figure
  }

  /**
   * AnnotationSet 
   * UI Structure for Figure Annotations
   * 
   * @typedef {Object} AnnotationSet
   * @property {String} input Input element type "radio|checkbox"
   * @property {<Array[Annotation]>} items
   * @property {String} title The title of the set of UI option items
   * @return {AnnotationSet}
   */
  annotationSet(data) {
    const { input, items, title } = data
    return {
      input: input || 'radio',
      items: items.map((item) => new Annotation(this.figure, item)),
      title
    }
  }

  /**
   * Iterates over a Figure's annotation sets and creates annotation sets
   * with Annotation instances for each item in set.items
   * @return {<Array[AnnotationSet]>}
   */
  create() {
    const { annotations } = this.figure.data
    if (!annotations) return
    return annotations.map((data) => this.annotationSet(data))
  }
}
