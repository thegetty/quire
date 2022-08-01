const chalkFactory = require('~lib/chalk')
const { oneLine } = require('~lib/common-tags')

const { warn } = chalkFactory('shortcodes:figure')

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
module.exports = function (eleventyConfig, { page }) {
  const figureimage = eleventyConfig.getFilter('figureimage')
  const figurelabel = eleventyConfig.getFilter('figurelabel')
  const figuremodallink = eleventyConfig.getFilter('figuremodallink')
  const figuresoundcloud = eleventyConfig.getFilter('figuresoundcloud')
  const figuretable = eleventyConfig.getFilter('figuretable')
  const figurevideo = eleventyConfig.getFilter('figurevideo')
  const getFigure = eleventyConfig.getFilter('getFigure')
  const slugify = eleventyConfig.getFilter('slugify')

  const { epub, pdf } = eleventyConfig.globalData.config.params

  return async function (id, classes=[]) {
    classes = typeof classes === 'string' ? [classes] : classes

    /**
     * Merge figures.yaml data and additional params
     */
    let figure = getFigure(id)
    if (!figure) {
      warn(`The figure id "${id}" was found in the template "${page.inputPath}", but is not defined in "figures.yaml"`)
      return ''
    }
    figure = { ...figure, ...arguments }
    if (!page.figures) page.figures = [];
    page.figures.push(figure);

    const { media_type: mediaType } =  figure

    const component = async (figure) => {
      switch (true) {
        case (epub || pdf) && ['soundcloud', 'youtube'].includes(mediaType):
          return figureplaceholder(figure)
        case mediaType === 'soundcloud':
          return figuresoundcloud(figure)
        case mediaType === 'table':
          return await figuretable(figure)
        case mediaType === 'video':
        case mediaType === 'vimeo':
        case mediaType === 'youtube':
          return figurevideo(figure)
        default:
          return await figureimage(figure)
      }
    }

    return oneLine`
      <figure id="${slugify(id)}" class="${['q-figure', 'q-figure--' + mediaType, ...classes].join(' ')}">
        ${await component(figure)}
      </figure>
    `
  }
}
