const path = require('path')
const getSequenceFiles = require('./get-sequence-files')
const SequenceItem = require('./item')

/**
 * @typedef {Object} Sequence
 * @property {String} dir             The directory path where sequence image files are located
 * @property {Object} figure          The figure data
 * @property {<Array[String]>} files  An array of sequence image filenames
 * @property {String} regex           A regex pattern to match against sequence image filenames
 *
 * @return {Sequence}
 */
module.exports = class Sequence {
  constructor(figure, sequence) {
    const { iiifConfig } = figure
    this.dir = sequence.id
    this.figure = figure
    this.files = getSequenceFiles(sequence, iiifConfig)
    this.regex = sequence.regex
    this.start = sequence.start
  }

  get items() {
    const { annotations, data } = this.figure
    const { label } = data
    const annotationItems = annotations
      ? annotations.flatMap(({ items }) => items)
      : []
    return this.files.map((filename) => {
      const src = path.join(this.dir, filename)
      // TODO: replace `target` with `region` once that gets merged in
      const sequenceItemAnnotations = annotationItems
        .filter(({ target }) => target && target === src)
      return new SequenceItem(
        this.figure,
        {
          annotations: sequenceItemAnnotations,
          label,
          src
        }
      )
    })
  }

  get startIndex() {
    if (!this.start) return 0
    return this.items.findIndex(({ src }) => {
      const { base } = path.parse(src)
      return this.start === base
    }) || 0
  }
}
