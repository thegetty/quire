const chalkFactory = require('~lib/chalk')
const { oneLine } = require('~lib/common-tags')

const logger = chalkFactory('shortcodes:figure')

/**
 * Render an HTML <figure> element
 *
 * @param      {string}   alt
 * @param      {string}   aspectRatio
 * @param      {string}   caption
 * @param      {string}   credit
 * @param      {string}   download
 * @param      {string}   id
 * @param      {string}   label
 * @param      {string}   mediaId
 * @param      {string}   mediaType
 * @param      {string}   src
 *
 * @return     {boolean}  An HTML <figure> element
 */
module.exports = function (eleventyConfig) {
  const getFigure = eleventyConfig.getFilter('getFigure')
  const quireFigure = eleventyConfig.getFilter('quireFigure')
  const { imageDir } = eleventyConfig.globalData.config.figures

  return async function (id, classes=[]) {
    classes = typeof classes !== 'string' ? classes.join(' ') : classes

    /**
     * Merge figures.yaml data and additional params
     */
    let figure = getFigure(id)
    if (!figure) {
      logger.warn(`The figure id "${id}" was found in the template "${this.page.inputPath}", but is not defined in "figures.yaml"`)
      return ''
    }
    figure = { ...figure, ...arguments }
    this.page.figures ||= []
    this.page.figures.push(figure)

    /**
     * Render static versions of IIIF images inline
     */
    const isStatic = true

    return await quireFigure.call(this, classes, id, imageDir, isStatic)
  }
}
