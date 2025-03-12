import { html } from '#lib/common-tags/index.js'

/**
 * A shortcode for including an inline SVG icon with a PNG fallback.
 *
 * Should be passed with a "type" that corresponds to an id in the "icons" partial, and an optional "description"
 *
 * @example.js
 * icon("link", "Open in new window")
 *
 * @example.liquid
 * {% icon type="link", description="Open in new window" %}
 */
export default function (eleventyConfig) {
  return function (params) {
    const { description, type } = params
    const descriptionElement = description
      ? `<span class="visually-hidden" data-outputs-exclude="epub,pdf">${description}</span>`
      : ''

    return html`
      <svg data-outputs-exclude="epub,pdf">
        <switch>
          <use xlink:href="#${type}-icon"></use>
        </switch>
      </svg>
      ${descriptionElement}
    `
  }
}
