const path = require('path')
const { html } = require('~lib/common-tags')
/**
 * Renders a TOC List
 *
 * @param     {Object} eleventyConfig
 * @param     {Object} params
 * @property  {Object} collection An eleventy collection, such as `collection.tableOfContentsEpub`
 * @property  {Object} page The current page object
 * @property  {String} presentation How the TOC should display. Possible values: ['abstract', 'brief', 'grid']
 *
 * @return {String} TOC list
 */
module.exports = function(eleventyConfig) {
  const eleventyNavigation = eleventyConfig.getFilter('eleventyNavigation')
  const tableOfContentsItem = eleventyConfig.getFilter('tableOfContentsItem')

  return function(params) {
    const { collection, currentPageUrl, key, presentation } = params

    const sectionNavigation = eleventyNavigation(collection, key)
    const navigation = sectionNavigation.length
      ? sectionNavigation
      : eleventyNavigation(collection)

    const filterCurrentPage = (pages) => {
      return pages.filter((page) => {
        return page && page.url !== currentPageUrl
      })
    }

    const listItem = (page) => {
      if (presentation !== 'brief' && page.children && page.children.length) {
        const children = renderList(page.children)
        return `${tableOfContentsItem({ children, page, presentation })}`
      }
      return `${tableOfContentsItem({ page, presentation })}`
    }

    const renderList = (pages) => {
      const otherPages = filterCurrentPage(pages)
      return html`
        <ol class="table-of-contents-list">
          ${otherPages.map(listItem)}
        </ol>
      `
    }

    return html`
      <nav class="table-of-contents menu-list">
        ${renderList(navigation)}
      </nav>
    `
  }
}
