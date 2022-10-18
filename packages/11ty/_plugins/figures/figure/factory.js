const chalkFactory = require('~lib/chalk')
const Figure = require('./index')
const ImageProcessor = require('../image/processor')
const path = require('path')

const logger = chalkFactory('Figure Processing')

/**
 * Factory class to create instances of `Figure` on which process is called
 * to generate files and set computed properties used the Quire shortcodes.
 *
 * @class FigureFactory
 */
module.exports = class FigureFactory {
  constructor(iiifConfig) {
    this.iiifConfig = iiifConfig
    this.imageProcessor = new ImageProcessor(iiifConfig).processImage
  }

  /**
   * Creates a `figure`` instance and calls its `processFiles` method
   * to create the IIIF info or manifest file and generate image tiles.
   *
   * @param {Object} data Figure entry data from `figures.yaml`
   * 
   * @return {Object}
   * @property {Figure} Figure instance
   * @property {Array} errors `processFiles` errors
   */
  async create(data) {
    const figure = new Figure(this.iiifConfig, this.imageProcessor, data)
    const { errors } = await figure.processFiles()
    return { figure, errors }
  }
}
