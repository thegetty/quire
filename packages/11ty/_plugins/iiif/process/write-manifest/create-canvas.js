const path = require('path')
const sharp = require('sharp')
const chalkFactory = require('~lib/chalk')
const { error } = chalkFactory('plugins:iiif:create manifest')
const initCreateAnnotations = require('./create-annotations')

/**
 * Creates a canvas with the dimensions of `figure.src`
 * or the first annotation choice
 * Calls `createAnnotations`
 * 
 * @todo Add figure.src as item with `type="Image"` to `canvas.items`
 *
 * @param  {Object} eleventyConfig
 * @param  {Object} figure
 * @param  {String} iiifId
 * @return {Function}
 */
module.exports = async function (eleventyConfig, figure, iiifId) {
  const createAnnotations = initCreateAnnotations(eleventyConfig, figure)
  const { inputDir } = eleventyConfig.globalData.iiifConfig
  const { annotations, id, src } = figure
  /**
   * Use dimensions of figure.src or first choice as canvas dimensions
   */
  const firstChoice = annotations
    .flatMap(({ items }) => items)
    .find(({ target }) => !target)
  const canvasImagePath = src || firstChoice.src

  if (!canvasImagePath) {
    error(`IIIF figures require a "src" or "annotations" property ${id}`)
  }
  const canvasImageFullPath = path.join(inputDir, canvasImagePath)

  const { height, width } = await sharp(canvasImageFullPath).metadata()

  return function (manifest) {
    const canvasId = [iiifId, 'canvas'].join('/')

    manifest.createCanvas(canvasId, (canvas) => {
      canvas.height = height
      canvas.width = width
      annotations.forEach((annotationSet) => {
        createAnnotations(canvas, annotationSet)
      })
    })
  }
}
