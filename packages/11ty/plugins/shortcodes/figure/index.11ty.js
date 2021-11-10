const { html } = require('common-tags')

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
module.exports = function (eleventyConfig, { config, figures }, id, classes=[]) {
  figures = Object.fromEntries(figures.figure_list.map((figure) => {
    const { caption, credit, download, id, label, media_id, media_type, src } = figure
    return [ id, { caption, credit, download, id, label, media_id, media_type, src }]
  }))

  classes = typeof classes === 'string' ? [classes] : classes

  /**
   * @todo refactor q-figure--group styles using BEM and remove this conditional
   */
  if (!classes.includes('q-figure--group__item')) {
    classes.push('q-figure')
  }

  const qfigureimage = eleventyConfig.getFilter('qfigureimage')
  const qfigurelabel = eleventyConfig.getFilter('qfigurelabel')
  const modalLink = eleventyConfig.getFilter('qfiguremodallink')
  const slugify = eleventyConfig.getFilter('slugify')

  if (!figures) {
    console.warn(`Error: Unable to find figures data, see docs`)
    return ''
  }

  const figure = figures[id]

  if (!figure) {
    console.warn(`Error: the id '${id}' was not found in 'figures.yaml'`)
    return ''
  }

  const mediaElement = (figure) => {
    switch(true) {
      case figure.media_type === 'youtube':
        break
      case figure.media_type === 'vimeo':
        break
      case figure.media_type === 'soundcloud':
        break
      case figure.media_type === 'website':
        break
      case figure.media_type === 'table':
        break
      default:
        const imageElement = qfigureimage(figure)
        return (config.params.figureLabelLocation === 'on-top') 
          ? modalLink(figure, imageElement + qfigurelabel(figure))
          : imageElement
        break
    }
  }

  return html`
    <figure id="${slugify(id)}" class="${classes.join(' ')}">
      <div class="q-figure__wrapper">
        ${mediaElement(figure)}
      </div>
    </figure>
  `
}
