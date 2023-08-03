const { oneLine } = require('~lib/common-tags')

/**
 * Renders a link
 *
 * @param  {Object} link
 * @property  {String} link_relation The value of the anchor tag 'rel' property
 * @property  {String} media_type The value of the anchor tag 'type' property
 * @property  {String} name The link text
 * @property  {String} url
 * @param  {Array<String>} classes
 * @return {String}                anchor tag
 */
module.exports = function(eleventyConfig) {
  return function (params) {
    const { classes = [], link_relation, media_type, name, url } = params
    const rel = link_relation ? `rel="${link_relation}"` : ''
    const type = media_type ? `type="${media_type}"` : ''
    return oneLine`
      <a href="${url}" class="${classes.join(' ')}" target="_blank" ${rel} ${type}>
        ${name}
      </a>
    `
  }
}
