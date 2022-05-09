/**
 * Renders the menu list
 *
 * @param      {Object}  eleventyConfig
 * @param      {Object}  params
 */
module.exports = function(eleventyConfig) {
  const menuItem = eleventyConfig.getFilter('menuItem')

  const { config } = eleventyConfig.globalData

  return function(params) {
    const { pages } = params

    let renderedSection

    const listItems = pages
      .map((page) => {
        let listItem = ''
        if (!page.data.section) {
          return `<li class="page-item">${menuItem({ page: page.data })}</li>`
        } else if (
          page.data.layout === 'table-of-contents' &&
          page.data.section !== renderedSection
        ) {
          renderedSection = page.data.section
          listItem += `<li class="section-item">${menuItem({ page: page.data })}`
          if (config.params.tocType === 'full') {
            subListItems = pages
              .filter((item) => item.data.section === page.data.section && item.data.layout !== 'table-of-contents')
              .map((item) => {
                if (page.fileSlug !== item.fileSlug)
                  return `<li class="page-item">${menuItem({ page: item.data })}</li>`
              })
            listItem += `<ul>${subListItems.join('')}</ul>`
          }
          listItem += '</li>'
          return listItem
        }
      })
    return listItems.join('')
  }
}
