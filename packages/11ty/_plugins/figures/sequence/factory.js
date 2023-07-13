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
    this.dirs = figure.iiifConfig.dirs
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
        files = this.getSequenceFiles(sequence)
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
  getSequenceFiles(sequence) {
    if (!sequence) return
    
    const { imagesDir, inputRoot } = this.dirs
    const sequenceDir = path.join(inputRoot, imagesDir, sequence.id)
    
    /**
     * Default file name pattern for 360° images,
     * zero padded three digit degrees
     * @todo refactor to use default pattern in publication configuration
     */
    const defaultPattern = /^\d{3}\.(jpg|png)$/
    
    const sequenceRegex = sequence.regex
      ? new RegExp(sequence.regex.slice(1, -1))
      : defaultPattern
    
    // @todo log a warning or perhaps throw an error?
    if (!fs.existsSync(sequenceDir)) return
    
    return fs
      .readdirSync(sequenceDir)
      .filter((filename) => filename.match(sequenceRegex))
  }
}
