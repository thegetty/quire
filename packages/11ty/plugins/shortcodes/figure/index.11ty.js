const { html } = require('common-tags')

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
module.exports = function (eleventyConfig, id, modifier) {
  const slugify = eleventyConfig.getFilter('slugify')

  return html`
    <figure id="${slugify(id)}" class="q-figure ${modifier}">
      <div class="q-figure__wrapper">
        <img alt="" class="q-figure__image" src=""/>
      </div>
    </figure>
  `
}
