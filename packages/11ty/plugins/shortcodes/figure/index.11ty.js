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
module.exports = function (eleventyConfig, { config, figures }, id, modifier) {
  figures = Object.fromEntries(figures.figure_list.map((figure) => {
    const { caption, credit, download, id, label, media_id, media_type, src } = figure
    return [ id, { caption, credit, download, id, label, media_id, media_type, src }]
  }))

  const qfigurecaption = eleventyConfig.getFilter('qfigurecaption')
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
  const labelElement = qfigurelabel(figure)
  const imageElement = (config.params.figureLabelLocation === 'on-top') 
    ? modalLink(figure, qfigureimage(figure) + labelElement)
    : qfigureimage(figure)

  const imageCaptionElement = (config.params.figureLabelLocation === 'below') 
    ? qfigurecaption(figure, labelElement) 
    : qfigurecaption(figure)

  return html`
    <figure id="${slugify(id)}" class="q-figure ${modifier}">
      <div class="q-figure__wrapper">
        ${imageElement}
        ${imageCaptionElement}
      </div>
    </figure>
  `
}
