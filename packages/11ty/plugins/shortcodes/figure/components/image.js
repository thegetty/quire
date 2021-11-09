const { html } = require('common-tags')
const path = require('path')

/**
 * Renders an <img> element
 *
 * @param      {Object}   data    Image alt text and src properties
 * @return     {String}  An HTML <img> element
 */
module.exports = function (eleventyConfig, globalData, { alt='', src='' }) {
  const imageSrc = path.join('/_assets/img', src)

  return html`
    <img alt="${alt}" class="q-figure__image" src="${imageSrc}"/>
  `
}
