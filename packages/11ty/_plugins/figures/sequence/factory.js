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
   * @return {<Array[Sequence]>}
   */
  create() {
    const { sequences } = this.figure.data
    if (!sequences) return
    return sequences.map((sequence) => new Sequence(this.figure, sequence))
  }
}
