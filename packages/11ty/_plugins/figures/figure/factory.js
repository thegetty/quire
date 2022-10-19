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
    this.imageProcessor = new ImageProcessor(iiifConfig)
  }

  /**
   * Creates a `Figure` instance and calls its `processFiles` method
   * to create the IIIF info, manifest, and generate image tiles.
   *
   * @param {Object} data  A figure entry from `figures.yaml`
   * 
   * @return {Object}
   * @property {Figure} figure  A new Figure instance
   * @property {Array} errors  `processFiles` errors
   */
  async create(data) {
    const imageProcessor = this.imageProcessor.processImage
    const figure = new Figure(this.iiifConfig, imageProcessor, data)
    const { errors } = await figure.processFiles()
    return { figure, errors }
  }
}
