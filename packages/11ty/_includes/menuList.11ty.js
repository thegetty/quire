const contentsItemMenu = require("./contentsItemMenu.11ty.js")

module.exports = function (data) {
  const {
    collections,
    config
  } = data

  /**
   * @todo get pages from global data
   */
  const pages = collections.all.filter(({ data }) => data.type !== "data")

  let renderedSection

  const listItems = pages.map((page) => {
    let listItem = ''
    if (page.data.layout !== 'contents' && !page.data.section) {
      return `<li class="page-item">${contentsItemMenu(data, page)}</li>`
    } else if (
      page.data.layout === 'contents' &&
      page.data.section !== renderedSection
    ) {
      renderedSection = page.data.section
      listItem += `<li class="section-item">${contentsItemMenu(data, page)}`
      if (config.params.tocType === 'full') {
        subListItems = pages
          .filter((item) => item.data.section === page.data.section && item.data.layout !== 'contents')
          .map((item) => {
            if (page.fileSlug !== item.fileSlug)
              return `<li class="page-item">${contentsItemMenu(data, item)}</li>`
          })
        listItem += `<ul>${subListItems.join('')}</ul>`
      }
      listItem += '</li>'
      return listItem
    }
  })
  return listItems.join('')
}
