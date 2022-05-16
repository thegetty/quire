const { renderOneLine } = require('_plugins/common-tags/')

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
  const figureyoutube = eleventyConfig.getFilter('figureyoutube')
  const getFigure = eleventyConfig.getFilter('getFigure')
  const slugify = eleventyConfig.getFilter('slugify')

  const { epub, pdf } = eleventyConfig.globalData.config.params

  return async function (id, classes=[]) {
    classes = typeof classes === 'string' ? [classes] : classes

    /**
     * Merge figures.yaml data and additional params
     */
    let figure = id ? getFigure(id) : {}
    figure = { ...figure, ...arguments }
    if (!page.figures) page.figures = [];
    page.figures.push(figure);

    const { media_type: mediaType } =  figure

    const component = async (figure) => {
      switch (true) {
        case (epub || pdf) && ['soundcloud', 'youtube'].includes(mediaType):
          return figureplaceholder(figure)
        case mediaType === 'youtube':
          return figureyoutube(figure)
        case mediaType === 'vimeo':
          return 'UNIMPLEMENTED'
        case mediaType === 'soundcloud':
          return figuresoundcloud(figure)
        case mediaType === 'table':
          return await figuretable(figure)
        default:
          return await figureimage(figure)
      }
    }

    return renderOneLine`
      <figure id="${slugify(id)}" class="${['q-figure', ...classes].join(' ')}">
        ${await component(figure)}
      </figure>
    `
  }
}
