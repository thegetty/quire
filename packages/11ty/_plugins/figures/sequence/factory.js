const fs = require('fs')
const path = require('path')
const Sequence = require('./index')

/**
 * The SequenceFactory creates sequences for a Figure instance
 */
module.exports = class SequenceFactory {
  /**
   * @param  {Figure} figure
   */
  constructor(figure) {
    this.figure = figure
  }

  /**
   * Iterates over a Figure's sequences and creates a sequence for each one
   *
   * @property {<Array[String]>} files  (Optional) An array of sequence image filenames (only used for passing through fixture data in tests)
   * @return {<Array[Sequence]>}
   */
  create(files) {
    const { sequences } = this.figure.data
    if (!sequences) return
    return sequences.map((sequence) => {
      if (!files) {
        files = getSequenceFiles(sequence, iiifConfig)
      }
      return new Sequence(this.figure, sequence, files)
    })
  }

  /**
   * Read the directory where sequence images exist to create an array of filenames
   *
   * @param  {Object} figure     Figure data
   * @param  {Object} iiifConfig IIIF Config data
   * @return {Array<string>}     An array of filenames
   */
  getSequenceFiles(sequence, iiifConfig) {
    if (!sequence) return
    const { dirs } = iiifConfig
    const { imagesDir, inputRoot } = dirs
    const sequenceDir = path.join(inputRoot, imagesDir, sequence.id)
    const defaultSequenceRegex = /^\d{3}\.(jpg|png)$/
    const sequenceRegex = sequence.regex
      ? new RegExp(sequence.regex.slice(1, -1))
      : defaultSequenceRegex
    if (!fs.existsSync(sequenceDir)) return
    return fs
      .readdirSync(sequenceDir)
      .filter((sequenceItemFilename) => sequenceItemFilename.match(sequenceRegex))
  }
}
