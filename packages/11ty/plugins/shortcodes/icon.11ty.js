/**
 * A shortcode for including an inline SVG icon with a PNG fallback.
 *         
 * Should be passed with a "type" that corresponds to an id in the "icons" partial, and an optional "description"
 *
 * Example: 
 * qicon("link", "Open in new window")
 * {% qicon "link", "Open in new window" %}
 */

const path = require('path')

module.exports = function(eleventyConfig, { config }, type, description) {
  const iconPath = path.join(config.params.imageDir, 'icons', `${type}.png`)
  return `
    <span class="remove-from-epub">
      <svg>
        <switch>
          <use xlink:href="#${ type }-icon"></use>
          <foreignObject width="24" height="24">
            <img src="${ iconPath }" alt="${ description }" />
          </foreignObject>
        </switch>
      </svg>
      <span class="visually-hidden">${ description }</span>
    </span>
`
}