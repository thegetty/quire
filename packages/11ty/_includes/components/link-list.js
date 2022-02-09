const { html } = require('common-tags')
const link = require('../link.js')

/**
 * Renders a list of links with optional wrapper classes
 *
 * @param  {Object} eleventyConfig
 * @param  {Object} globalData
 * @param  {Array<Object>} links
 * @property  {String} link_relation The value of the anchor tag 'rel' property
 * @property  {String} media_type The value of the anchor tag 'type' property
 * @property  {String} name The link text
 * @property  {String} url
 * @param  {Array<String>} classes
 * @return {String}                Unordered list of links
 */
module.exports = function (eleventyConfig, data, { links = [], classes = [] }) {
  if (!links.length) return ''

  return html`
    <ul class="${classes.join(' ')}">
      ${links.map((item) => `<li>${link(item)}</li>`).join('')}
    </ul>
  `
};
