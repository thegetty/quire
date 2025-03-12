/**
 * Render `table-of-contents` component with data from collections.pdf
 */
export default function (eleventyConfig) {
  const tableOfContentsList = eleventyConfig.getFilter('tableOfContentsList')
  return function (params) {
    const { collections, currentPageUrl, key, presentation } = params
    return tableOfContentsList({
      collection: collections.tableOfContentsPdf,
      currentPageUrl,
      key,
      presentation
    })
  }
}
