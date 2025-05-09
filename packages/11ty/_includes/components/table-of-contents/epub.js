/**
 * Render `table-of-contents` component with data from collections.epub
 */
export default function (eleventyConfig) {
  const tableOfContentsList = eleventyConfig.getFilter('tableOfContentsList')
  return function (params) {
    const { collections, currentPageUrl, key, presentation } = params
    return tableOfContentsList({
      collection: collections.tableOfContentsEpub,
      currentPageUrl,
      key,
      presentation
    })
  }
}
