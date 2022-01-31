/**
 * Renders the menu list
 *
 * @param  {Object} context
 * @param  {Array<Object>} pages - the eleventyComputed `pages` property
 *
 * @return {String} Menu list markup
 */
module.exports = function ({ eleventyConfig, globalData }, pages) {
  const { config } = globalData
  const menuItem = eleventyConfig.getFilter('menuItem')

  let renderedSection

  const listItems = pages
    .filter(({ data }) => data.menu !== false)
    .map((page) => {
      let listItem = ''
      if (page.data.layout !== 'contents' && !page.data.section) {
        return `<li class="page-item">${menuItem(page)}</li>`
      } else if (
        page.data.layout === 'contents' &&
        page.data.section !== renderedSection
      ) {
        renderedSection = page.data.section
        listItem += `<li class="section-item">${menuItem(page)}`
        if (config.params.tocType === 'full') {
          subListItems = pages
            .filter((item) => item.data.section === page.data.section && item.data.layout !== 'contents')
            .map((item) => {
              if (page.fileSlug !== item.fileSlug)
                return `<li class="page-item">${menuItem(item)}</li>`
            })
          listItem += `<ul>${subListItems.join('')}</ul>`
        }
        listItem += '</li>'
        return listItem
      }
    })
  return listItems.join('')
}
