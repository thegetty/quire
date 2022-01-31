/**
 * Renders the "Other Formats" and "Resources" sections of the menu
 *
 * @param  {Object} context
 *
 * @return {String} Other Formats & Resources
 */
module.exports = function({ eleventyConfig, globalData }) {
  const { publication } = globalData

  if (!Array.isArray(publication.resource_link)) return ''

  const linkList = eleventyConfig.getFilter('linkList')

  const otherFormats = publication.resource_link.filter(({ type }) => type === 'other-format')
  const relatedResources = publication.resource_link.filter(({ type }) => type === 'related-resource')

  const resourceElement = relatedResources.length
  ? `
        <div class="quire-menu__formats">
          <h6>Resources</h6>
          <div role="complementary" aria-label="related resources">
            ${linkList(relatedResources, ["menu-list"])}
          </div>
        </div>
      `
  : ''

  const otherFormatElement = otherFormats.length
  ? `
    <div class="quire-menu__formats">
      <h6>Other Formats</h6>
      <div role="complementary" aria-label="downloads">
        ${linkList(otherFormats, ["menu-list"])}
      </div>
    </div>
      `
  : ''

  return `
    ${resourceElement}
    ${otherFormatElement}
  `
}
