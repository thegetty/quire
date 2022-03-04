/**
 * Renders the menu list
 *
 * @param      {Object}  eleventyConfig
 * @param      {Object}  globalData
 * @param      {Object}  params
 */
module.exports = function(eleventyConfig, globalData) {
  const menuItem = eleventyConfig.getFilter('menuItem')

  const { config } = globalData

  return function(params) {
    const { pages } = params

    let renderedSection

    const listItems = pages
      .filter(({ data }) => data.menu !== false)
      .map((page) => {
        let listItem = ''
        if (page.data.layout !== 'contents' && !page.data.section) {
          return `<li class="page-item">${menuItem({ page })}</li>`
        } else if (
          page.data.layout === 'contents' &&
          page.data.section !== renderedSection
        ) {
          renderedSection = page.data.section
          listItem += `<li class="section-item">${menuItem({ page })}`
          if (config.params.tocType === 'full') {
            subListItems = pages
              .filter((item) => item.data.section === page.data.section && item.data.layout !== 'contents')
              .map((item) => {
                if (page.fileSlug !== item.fileSlug)
                  return `<li class="page-item">${menuItem({ page: item })}</li>`
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
