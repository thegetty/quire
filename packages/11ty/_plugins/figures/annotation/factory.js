import Annotation from './index.js'

/**
 * @class AnnotationFactory
 *
 * Creates Annotation instances from the Figure data embedded in FigureMedia instances.
 *
 */
export default class AnnotationFactory {
  /**
   * @param  {FigureMedia} FigureMedia data
   */
  constructor (figure) {
    this.figure = figure
  }

  /**
   * AnnotationSet
   * UI Structure for Annotations
   *
   * @typedef {Object} AnnotationSet
   * @property {String} input Input element type "radio|checkbox"
   * @property {<Array[Annotation]>} items
   * @property {String} title The title of the set of UI option items
   * @return {AnnotationSet}
   */
  annotationSet (data) {
    const { input, items, title } = data
    return {
      input: input || 'radio',
      items: items.map((item) => new Annotation(this.figure, item)),
      title
    }
  }

  /**
   * Iterates over figure data's annotation sets and creates annotation sets
   * with Annotation instances for each item in set.items
   * @return {<Array[AnnotationSet]>}
   */
  create () {
    const { annotations } = this.figure.data
    if (!annotations) return
    return annotations.map((data) => this.annotationSet(data))
  }
}
