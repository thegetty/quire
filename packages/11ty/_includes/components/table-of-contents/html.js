/**
 * Render `table-of-contents` component with data from collections.html
 */
module.exports = function(eleventyConfig) {
  const tableOfContentsList = eleventyConfig.getFilter('tableOfContentsList')
  return function(params) {
    const { collections, currentPageUrl, key, presentation } = params
    return tableOfContentsList({ 
      collection: collections.tableOfContentsHtml,
      currentPageUrl,
      key,
      presentation
    })
  }
}
