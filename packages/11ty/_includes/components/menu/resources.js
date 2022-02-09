const { html } = require('common-tags')

/**
 * Renders the "Other Formats" and "Resources" sections of the menu
 *
 * @param      {Object}  eleventyConfig
 * @param      {Object}  data
 */
module.exports = function(eleventyConfig, data) {
  const { publication } = data

  if (!Array.isArray(publication.resource_link)) return ''

  const linkList = eleventyConfig.getFilter('linkList')

  const otherFormats = publication.resource_link.filter(({ type }) => type === 'other-format')
  const relatedResources = publication.resource_link.filter(({ type }) => type === 'related-resource')

  const resourceElement = relatedResources.length
  ? html`
    <div class="quire-menu__formats">
      <h6>Resources</h6>
      <div role="complementary" aria-label="related resources">
        ${linkList(data, relatedResources, ['menu-list'])}
      </div>
    </div>`
  : ''

  const otherFormatElement = otherFormats.length
  ? html`
    <div class="quire-menu__formats">
      <h6>Other Formats</h6>
      <div role="complementary" aria-label="downloads">
        ${linkList(data, otherFormats, ['menu-list'])}
      </div>
    </div>`
  : ''

  return html`
    ${resourceElement}
    ${otherFormatElement}
  `
}
