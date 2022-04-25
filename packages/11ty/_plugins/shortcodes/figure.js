const { oneLine } = require('common-tags')

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
module.exports = function (eleventyConfig, globalData) {
  const figureimage = eleventyConfig.getFilter('figureimage')
  const figurelabel = eleventyConfig.getFilter('figurelabel')
  const figuremodallink = eleventyConfig.getFilter('figuremodallink')
  const figuresoundcloud = eleventyConfig.getFilter('figuresoundcloud')
  const figuretable = eleventyConfig.getFilter('figuretable')
  const figureyoutube = eleventyConfig.getFilter('figureyoutube')
  const getFigure = eleventyConfig.getFilter('getFigure')
  const slugify = eleventyConfig.getFilter('slugify')

  const { epub, pdf } = globalData.config.params

  return async function (params) {
    let { id, class: classes=[] } = params
    classes = typeof classes === 'string' ? [classes] : classes

    /**
     * Merge figures.yaml data and additional params
     */
    let figure = id ? getFigure(id) : {}
    figure = { ...figure, ...params }

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
          return figureimage(figure)
      }
    }

    return oneLine`
      <figure id="${slugify(id)}" class="${['q-figure', ...classes].join(' ')}">
        ${await component(figure)}
      </figure>
    `
  }
}
