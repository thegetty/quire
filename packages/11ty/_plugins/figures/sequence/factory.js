const getSequenceFiles = require('./get-sequence-files')
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
}
