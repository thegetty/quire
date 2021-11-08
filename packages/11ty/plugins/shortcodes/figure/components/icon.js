const { html } = require('common-tags')

/**
 * A shortcode for including an inline SVG icon with a PNG fallback.
 * @param {String} type  corresponds to the id in icons.html
 * @param {String} [description]
 * @return {String}  An HTML <svg> element for the icon
 */
module.exports = function(eleventyConfig, { type, description }) {
  return html`
    <span class="remove-from-epub">
      <svg>
        <switch>
          <use xlink:href="#${type}-icon"/>
          <foreignObject width="24" height="24">
            <img src="_assets/img/icons/${type}.png" alt="${description}"/>
          </foreignObject>
        </switch>
      </svg>
      <span class="visually-hidden">${description}</span>
    </span>
  `
}
