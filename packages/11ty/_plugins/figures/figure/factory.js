const chalkFactory = require('~lib/chalk')
const Figure = require('./index')
const path = require('path')

const logger = chalkFactory('Figure Processing')

/**
 * The FigureFactory uses data from the IIIF Config and `figures.yaml`
 * to generate files and computed properties for consumption by Quire shortcodes
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
