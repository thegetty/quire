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
  const getFigure = eleventyConfig.getFilter('getFigure')
  const figureimage = eleventyConfig.getFilter('qfigureimage')
  const figurelabel = eleventyConfig.getFilter('qfigurelabel')
  const figuremodallink = eleventyConfig.getFilter('qfiguremodallink')
  const figuresoundcloud = eleventyConfig.getFilter('qfiguresoundcloud')
  const figurtable = eleventyConfig.getFilter('qfigurtable')
  const figureyoutube = eleventyConfig.getFilter('qfigureyoutube')
  const slugify = eleventyConfig.getFilter('slugify')

  return function ({ id, ['class']: classes=[] }) {
    classes = typeof classes === 'string' ? [classes] : classes
    /**
     * @todo refactor q-figure--group styles using BEM and remove this conditional
     */
    if (!classes.includes('q-figure--group__item')) {
      classes.push('q-figure')
    }

    const figure = getFigure(id)

    const component = (figure) => {
      switch (true) {
        case figure.media_type === 'youtube':
          return figureyoutube({ figure })
          break
        case figure.media_type === 'vimeo':
          break
        case figure.media_type === 'soundcloud':
          return figuresoundcloud({ figure })
        case figure.media_type === 'website':
          break
        case figure.media_type === 'table':
          return figuretable({ figure })
          break
        default:
          return figureimage({ figure })
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
}
