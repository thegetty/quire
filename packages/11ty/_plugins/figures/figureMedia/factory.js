import FigureMedia from './index.js'
import ImageProcessor from '../image/processor.js'

/**
 * Factory class to create instances of `FigureMedia` on which process is called
 * to generate files and set computed properties used the Quire shortcodes.
 *
 * @class FigureMediaFactory
 */
export default class FigureMediaFactory {
  constructor (iiifConfig) {
    this.iiifConfig = iiifConfig
    this.imageProcessor = new ImageProcessor(iiifConfig)
  }

  /**
   * Creates a `FigureMedia` instance and calls its `processFiles` method
   * to create the IIIF info, manifest, and generate image tiles.
   *
   * @param {Object} data  A figure entry from `figures.yaml`
   *
   * @return {Object}
   * @property {FigureMedia} figure  A new FigureMedia instance
   * @property {Array} errors  Any errors from asset handling
   */
  async create (data) {
    const processImage =
      this.imageProcessor.processImage.bind(this.imageProcessor)
    const figure = new FigureMedia(this.iiifConfig, processImage, data)
    const { errors } = await figure.processFigure()
    return { figure, errors }
  }
}
