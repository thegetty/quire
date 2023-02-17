const path = require('path')
const SequenceItem = require('./index')

/**
 * The SequenceFactory creates a sequence for a Figure instance
 */
module.exports = class SequenceFactory {
  /**
   * @param  {Figure} figure
   */
  constructor(figure) {
    this.figure = figure
  }

  /**
   * Iterates over a Figure's sequence files and creates annotation sets
   * with Annotation instances for each item in set.items
   * @return {<Array[AnnotationSet]>}
   */
  create() {
    const { sequenceFiles } = this.figure
    if (!sequenceFiles) return
    return sequenceFiles.map((sequenceItemFilename) => this.sequenceItem(sequenceItemFilename))
  }

  sequenceItem(sequenceItemFilename) {
    const { label } = this.figure.data
    const src = path.join(this.figure.sequenceDir, sequenceItemFilename)
    const baseSequenceImage = new SequenceItem(this.figure, { label, src })
    return {
      items: [baseSequenceImage]
    }
  }
}
