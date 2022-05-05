const path = require('path')
const { html } = require('common-tags')
/**
 * Renders a TOC List
 *
 * @param     {Object} eleventyConfig
 * @param     {Object} params
 *
 * @return {String} TOC list
 */
module.exports = function(eleventyConfig) {
  const eleventyNavigation = eleventyConfig.getFilter('eleventyNavigation')
  const tableOfContentsItem = eleventyConfig.getFilter('tableOfContentsItem')

  return function(params) {
    const { collection, type } = params
    const items = eleventyNavigation(collection)

    const renderList = (items) => {
      return html`
        <ul>
          ${items.map(item => {
            const page = collection.find(({ url }) => url === item.url)
            // console.warn(Object.keys(page.data).sort())
            if (item.children && item.children.length) {
              const children = renderList(item.children)
              return `${tableOfContentsItem({ page, children, type })}`
            }
            return `${tableOfContentsItem({ page, type })}`
          })}
        </ul>`
    }

    return html`
      <div class="menu-list">
        ${renderList(items)}
      </div>
    `
  }
}
