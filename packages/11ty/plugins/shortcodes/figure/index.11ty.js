const { html } = require('common-tags')
const image = require('./components/image')

/**
 * Render an HTML <figure> element
 *
 * @todo
 * Get attributes defined directly on shortcode
 * Get attributes from figures.yml
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
module.exports = function (eleventyConfig, { figures }, id, modifier) {
  figures = Object.fromEntries(figures.figure_list.map((figure) => {
    const { caption, credit, id, src } = figure
    return [ id, { caption, credit, src }]
  }))

  if (!figures) {
    console.warn(`Error: Unable to find figures data, see docs`)
    return ''
  }

  if (!figures[id]) {
    console.warn(`Error: the id '${id}' was not found in 'figures.yaml'`)
    return ''
  }

  const slugify = eleventyConfig.getFilter('slugify')
  const { alt, caption, credit, src } = figures[id]
  const imageElement = image(eleventyConfig, { alt, src })

  return html`
    <figure id="${slugify(id)}" class="q-figure ${modifier}">
      <div class="q-figure__wrapper">
        ${imageElement}
      </div>
    </figure>
  `
}
