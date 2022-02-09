const { oneLine } = require('common-tags');

/**
 * Renders a link
 *
 * @param  {Object} eleventyConfig
 * @param  {Object} data
 * @param  {Object} link
 * @property  {String} link_relation The value of the anchor tag 'rel' property
 * @property  {String} media_type The value of the anchor tag 'type' property
 * @property  {String} name The link text
 * @property  {String} url
 * @param  {Array<String>} classes
 * @return {String}                anchor tag
 */
module.exports = function (eleventyConfig, data, { classes = [], link_relation, media_type, name, url }) {
  return oneLine`
    <a href="${url}" class="${classes.join(' ')}" target="_blank" rel="${link_relation}" type="${media_type}">
      ${name}
    </a>
  `
}
