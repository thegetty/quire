const path = require('path')
const getSequenceFiles = require('./get-sequence-files')
const Annotation = require('../annotation')

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
    this.behavior = sequence.behavior
    this.dir = sequence.id
    this.figure = figure
    this.files = getSequenceFiles(sequence, iiifConfig)
    this.regex = sequence.regex
    this.start = sequence.start
    this.viewingDirection = sequence.viewing_direction
  }

  get items() {
    const { label } = this.figure.data
    return this.files.map((filename) => {
      const src = path.join(this.dir, filename)
      return new Annotation(this.figure, { label, src })
    })
  }

  get itemsWithTargetedAnnotations() {
    const { annotations } = this.figure
    const annotationItems = annotations
      ? annotations.flatMap(({ items }) => items)
      : []
    return this.items.map((item) => {
      const { src } = item
      // TODO: replace `target` with `region` once that gets merged in
      const sequenceItemAnnotations = annotationItems
        .filter(({ target }) => target && target === src)
      return {
        item,
        annotations: sequenceItemAnnotations
      }
    })
  }

  get startCanvas() {
    if (!this.start) return
    const startCanvasItem = this.items.find(({ src }) => {
      const { base } = path.parse(src)
      return this.start === base
    })
    return startCanvasItem ? path.join(this.figure.canvasId, startCanvasItem.id) : null
  }

  get startCanvasIndex() {
    if (!this.start) return 0
    const startCanvasIndex = this.items.findIndex(({ src }) => {
      const { base } = path.parse(src)
      return this.start === base
    })
    return startCanvasIndex
  }
}
