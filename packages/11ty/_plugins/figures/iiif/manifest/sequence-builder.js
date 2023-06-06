const path = require('path')

module.exports = class SequenceBuilder {
  static create(manifestObject, data) {
    const sequenceBuilder = new SequenceBuilder(data)
    return sequenceBuilder.createSequences(manifestObject)
  }

  constructor({ figure, sequenceItems }) {
    this.figure = figure
    this.sequences = figure.sequences
    this.sequenceItems = sequenceItems
  }

  get items() {
    return this.sequenceItems.map(this.createSequenceItem)
  }

  createSequenceItem(sequenceItem) {
    const { target } = sequenceItem
    return {
      id: target,
      type: 'Canvas'
    }
  }

  createSequence(sequence, index) {
    const { figure, label, viewingDirection='left-to-right' } = sequence
    const { iiifConfig, outputDir } = figure
    const { baseURI } = iiifConfig
    const items = this.items.slice(sequence.startIndex)
    const id = path.join(baseURI, outputDir, 'ranges', `${index}`)
    const structure = {
      id,
      items,
      type: 'Range',
      viewingDirection
    }
    if (label) {
      structure.label = { en: [ label ] }
    }
    return structure
  }

  createSequences(manifestObject) {
    if (!this.sequences || !this.sequences.length) return manifestObject
    manifestObject.structures = []
    this.sequences.forEach((sequence, index) => {
      const sequenceStructure = this.createSequence(sequence, index)
      manifestObject.structures.push(sequenceStructure)
    })
    return manifestObject
  }
}
