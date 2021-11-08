const { html } = require('common-tags')
const path = require('path')

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
module.exports = function (eleventyConfig, figures, id, modifier) {
  const slugify = eleventyConfig.getFilter('slugify')

  const { alt, caption, credit, src } = figures[id]
  const imageSrc = path.join(`_assets/img`, src)

  return html`
    <figure id="${slugify(id)}" class="q-figure ${modifier}">
      <div class="q-figure__wrapper">
        <img alt="${alt}" class="q-figure__image" src="${imageSrc}"/>
      </div>
    </figure>
  `
}
