import { html } from '#lib/common-tags/index.js'

/**
 * Renders a list of links with optional wrapper classes
 *
 * @param     {Object} eleventyConfig
 * @param     {Object} params
 * @property  {Array<Object>} links
 * @property  {Array<String>} classes
 * @return    {String}                Unordered list of links
 */
export default function (eleventyConfig) {
  const link = eleventyConfig.getFilter('link')

  return function (params) {
    const { links, classes = [] } = params
    if (!links) return ''

    return html`
      <ul class="${classes.join(' ')}">
        ${links.map((item) => `<li>${link(item)}</li>`).join('')}
      </ul>
    `
  }
}
