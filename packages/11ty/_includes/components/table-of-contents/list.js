const path = require('path')
const { html } = require('common-tags')
/**
 * Renders a TOC List
 *
 * @param     {Object} eleventyConfig
 * @param     {Object} params
 * @property  {Object} navigation An eleventyNavigation collection, such as `eleventyNavigation(collection.tableOfContents)`
 * @property  {Object} page The current page object
 * @property  {String} presentation How the TOC should display. Possible values: ['abstract', 'brief', 'grid']
 *
 * @return {String} TOC list
 */
module.exports = function(eleventyConfig) {
  const eleventyNavigation = eleventyConfig.getFilter('eleventyNavigation')
  const tableOfContentsItem = eleventyConfig.getFilter('tableOfContentsItem')

  return function(params) {
    const { navigation, presentation } = params

    const renderList = (pages) => {
      return html`
        <ul>
          ${pages.map((page) => {
            if (presentation !== 'brief' && page.children && page.children.length) {
              const children = renderList(page.children)
              return `${tableOfContentsItem({ children, page, presentation })}`
            }
            return `${tableOfContentsItem({ page, presentation })}`
          })}
        </ul>`
    }

    return html`
      <div class="menu-list">
        ${renderList(navigation)}
      </div>
    `
  }
}
