const { html } = require('~lib/common-tags')

/**
 * Renders the "Other Formats" and "Resources" sections of the menu
 *
 * @param      {Object}  eleventyConfig
 * @param      {Object}  params
 */
module.exports = function(eleventyConfig) {
  const { resource_link: resourceLinks } = eleventyConfig.globalData.publication

  return function() {
    if (!Array.isArray(resourceLinks)) return ''

    const linkList = eleventyConfig.getFilter('linkList')

    const otherFormats = resourceLinks.filter(({ type }) => type === 'other-format')
    const relatedResources = resourceLinks.filter(({ type }) => type === 'related-resource')

    const resourceElement = relatedResources.length
      ? html`
        <div class="quire-menu__formats">
          <h6>Resources</h6>
          <div role="complementary" aria-label="related resources">
            ${linkList({ links: relatedResources, classes: ['menu-list'] })}
          </div>
        </div>`
      : ''

    const otherFormatElement = otherFormats.length
      ? html`
        <div class="quire-menu__formats">
          <h6>Other Formats</h6>
          <div role="complementary" aria-label="downloads">
            ${linkList({ links: otherFormats, classes: ['menu-list'] })}
          </div>
        </div>`
      : ''

    return html`
      ${resourceElement}
      ${otherFormatElement}
    `
  }
}
