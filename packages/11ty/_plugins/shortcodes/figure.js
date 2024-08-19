const chalkFactory = require('~lib/chalk')
const { oneLine } = require('~lib/common-tags')

const logger = chalkFactory('shortcodes:figure')

const FETCH_PRIORITY_THRESHOLD = 2

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
  const figureAudio = eleventyConfig.getFilter('figureAudio')
  const figureImage = eleventyConfig.getFilter('figureImage')
  const figureLabel = eleventyConfig.getFilter('figureLabel')
  const figureModalLink = eleventyConfig.getFilter('figureModalLink')
  const figureTable = eleventyConfig.getFilter('figureTable')
  const figureVideo = eleventyConfig.getFilter('figureVideo')
  const getFigure = eleventyConfig.getFilter('getFigure')
  const slugify = eleventyConfig.getFilter('slugify')

  return async function (id, classes=[]) {
    classes = typeof classes === 'string' ? [classes] : classes

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

    // Pass a lazyload parameter for use in downstream components  
    const position = ( this.page.figures ?? [] ).length - 1
    const lazyLoading = position < FETCH_PRIORITY_THRESHOLD ? 'eager' : 'lazy'

    const { mediaType } = figure

    const component = async (figure) => {
      switch (true) {
        case mediaType === 'soundcloud':
          return figureAudio(figure)
        case mediaType === 'table':
          return await figureTable(figure)
        case mediaType === 'video':
        case mediaType === 'vimeo':
        case mediaType === 'youtube':
          return figureVideo(figure)
        default:
          return await figureImage(figure)
      }
    }

    return oneLine`
      <figure id="${slugify(id)}" class="${['q-figure', 'q-figure--' + mediaType, ...classes].join(' ')}">
        ${await component({...figure,lazyLoading})}
      </figure>
    `
  }
}
