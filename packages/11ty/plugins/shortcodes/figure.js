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
module.exports = function (context, params) {
  const { eleventyConfig, globalData: { config } } = context

  let { id, ['class']: classes=[] } = params
  classes = typeof classes === 'string' ? [classes] : classes

  /**
   * @todo refactor q-figure--group styles using BEM and remove this conditional
   */
  if (!classes.includes('q-figure--group__item')) {
    classes.push('q-figure')
  }

  const getFigure = eleventyConfig.getFilter('getFigure')
  const qfigureimage = eleventyConfig.getFilter('qfigureimage')
  const qfigurelabel = eleventyConfig.getFilter('qfigurelabel')
  const qfiguremodallink = eleventyConfig.getFilter('qfiguremodallink')
  const qfiguresoundcloud = eleventyConfig.getFilter('qfiguresoundcloud')
  const qfigureyoutube = eleventyConfig.getFilter('qfigureyoutube')
  const slugify = eleventyConfig.getFilter('slugify')

  const figure = getFigure(id)

  const component = (figure) => {
    switch(true) {
      case figure.media_type === 'youtube':
        return qfigureyoutube(figure)
        break
      case figure.media_type === 'vimeo':
        break
      case figure.media_type === 'soundcloud':
        return qfiguresoundcloud(figure)
      case figure.media_type === 'website':
        break
      case figure.media_type === 'table':
        break
      default:
        return qfigureimage(figure)
    }
  }

  return oneLine`
    <figure id="${slugify(id)}" class="${classes.join(' ')}">
      <div class="q-figure__wrapper">
        ${component(figure)}
      </div>
    </figure>
  `
}
