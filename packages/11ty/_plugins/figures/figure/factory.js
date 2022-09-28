const AnnotationFactory = require('../annotation/factory')
const AnnotationSetFactory = require('../annotation-set/factory')
const chalkFactory = require('~lib/chalk')
const Manifest = require('../iiif/manifest')
const path = require('path')
const { getPrintImage, isCanvas, isImageService } = require('../helpers')

const logger = chalkFactory('Figure Processing')

module.exports = class FigureFactory {
  constructor(eleventyConfig) {
    const { iiifConfig } = eleventyConfig.globalData
    this.annotationFactory = new AnnotationFactory(iiifConfig)
    this.annotationSetFactory = new AnnotationSetFactory(iiifConfig)
    this.errors = []
    this.iiifConfig = iiifConfig
  }

  /**
   * Creates a Quire figure
   * Including image file transformations, tiles, and IIIF manifests
   *
   * @param {Object} figure Figure entry data from `figures.yaml`
   * 
   * @typedef {Object} Figure
   * @property {Array<AnnotationSet>} annotations
   * @property {String} canvasId ID of IIIF canvas
   * @property {Boolean} isCanvas True if figure contains a canvas resource
   * @property {Boolean} isExternalResource True if figure references an externally hosted resource
   * @property {Boolean} isImageService True if figure contains an image service resource
   * @manifestId {String} manifestId ID of IIIF manifest
   * @printImage {String} printImage Optional path to an alternate image to use in print
   * 
   * @return {Figure}
   */
  create(data) {
    return {
      annotations: data.annotations,
      baseImageAnnotation: data.src && isCanvas(data) ? {
        label: data.label,
        src: data.src
      } : null,
      canvasId: data.canvasId,
      id: data.id,
      isCanvas: isCanvas(data),
      isImageService: isImageService(data),
      isExternalResource: (data.src && data.src.startsWith('http')) || data.manifestId,
      label: data.label,
      manifestId: data.manifestId,
      outputDir: path.join(this.iiifConfig.dirs.output, data.id),
      printImage: getPrintImage(this.iiifConfig, data),
      src: data.src,
      zoom: data.zoom,
      ...data
    }
  }

  /**
   * Process image files
   * @param  {Figure} figure
   * @return {Figure}
   */
  async processImageFiles(figure) {
    /**
     * @typedef {Object} AnnotationSet
     * @property {String} input Input element type "radio|checkbox"
     * @property {Array<Annotation>} items
     * @return {Array<AnnotationSet>}
     */
    const annotations = async () => {
      if (!Array.isArray(figure.annotations)) return;
      return await Promise.all(
        figure.annotations.map((set) => this.annotationSetFactory.create({ figure, set }))
      )
    }

    /**
     * Create image annotation for "base" image on canvas
     */
    const baseImage = async () => {
      return (
        figure.baseImageAnnotation &&
        (await this.annotationFactory.create({
          annotation: figure.baseImageAnnotation,
          figure
        }))
      )
    }

    figure.annotations = await annotations()
    figure.baseImage = await baseImage()

    if (figure.isCanvas && !figure.isExternalResource) {
      const manifest = new Manifest({ figure, iiifConfig: this.iiifConfig })
      const manifestJSON = await manifest.write()
      Object.assign(figure, {
        canvasId: manifestJSON.items[0].id,
        manifestId: manifestJSON.id
      })
    }

    return { errors: this.errors, figure }
  }
}
