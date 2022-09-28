const AnnotationFactory = require('../annotation/factory')

/**
 * Quire Figure Annotations conform to the W3C Web Annotation Format
 * @see {@link https://www.w3.org/TR/annotation-model/#annotations}
 */
module.exports = class AnnotationSetFactory {
  constructor(iiifConfig) {
    this.annotationFactory = new AnnotationFactory(iiifConfig)
    this.iiifConfig = iiifConfig
  }

  async create({ figure, set }) {
    const items = await Promise.all(
      set.items.map((item) => this.annotationFactory.create({ annotation: item, figure }))
    )
    return {
      input: set.input || 'radio',
      items
    }
  }
}
