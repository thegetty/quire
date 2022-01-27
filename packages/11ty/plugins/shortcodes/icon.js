const { html } = require('common-tags')
const path = require('path')

/**
 * A shortcode for including an inline SVG icon with a PNG fallback.
 *
 * Should be passed with a "type" that corresponds to an id in the "icons" partial, and an optional "description"
 *
 * @example
 * qicon("link", "Open in new window")
 *
 * @example
 * {% qicon "link", "Open in new window" %}
 */
module.exports = function(context, type, description) {
  const { eleventyConfig, globalData: { config } } = context
  const iconPath = path.join(config.params.imageDir, 'icons', `${type}.png`)

  return html`
    <span class="remove-from-epub">
      <svg>
        <switch>
          <use xlink:href="#${type}-icon"></use>
          <foreignObject width="24" height="24">
            <img src="${iconPath}" alt="${description}" />
          </foreignObject>
        </switch>
      </svg>
      <span class="visually-hidden">${description}</span>
    </span>
  `
}