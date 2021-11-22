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
module.exports = function(eleventyConfig, globalData, links=[], classes=[]) {
  const items = links.map(({ link_relation, media_type, name, url }) => {
    return `
      <li>
        <a href="${url}" target="_blank" rel="${link_relation}" type="${ media_type }">
          ${name}
        </a>
      </li>`
  })

  return `<ul class="${classes.join(' ')}">${items.join('')}</ul>`
}