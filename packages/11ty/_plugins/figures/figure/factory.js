const chalkFactory = require('~lib/chalk')
const Figure = require('./index')
const path = require('path')

const logger = chalkFactory('Figure Processing')

/**
 * The FigureFactory creates instance of `Figure` on which process is called
 * to generate files and set computed properties used the Quire shortcodes.
 */
module.exports = class FigureFactory {
  constructor(iiifConfig) {
    this.iiifConfig = iiifConfig
  }

  /**
   * Creates a Figure instance from `figure` data and calls `Figure.processFiles()`
   *
   * @param {Object} data Figure entry data from `figures.yaml`
   * 
   * @return {Object}
   * @property {Figure} Figure instance
   * @property {Array} errors `processFiles` errors
   */
  async create(data) {
    const figure = new Figure(this.iiifConfig, data)
    const { errors } = await figure.processFiles()
    return { figure, errors }
  }
}
