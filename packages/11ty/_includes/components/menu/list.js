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
    const { navigation } = params

    const renderList = (items) => {
      return items.map((item) => {
        let listItem = ''
        if (!item.children || item.children.length === 0) {
          return `<li class="page-item">${menuItem(item)}</li>`
        } else {
          listItem += `<li class="section-item">${menuItem(item)}`
          if (config.params.menuType !== 'brief') {
            listItem += `<ul>${renderList(item.children)}</ul>`
          }
          listItem += '</li>'
          return listItem
        }
      }).join('')
    }
      
    return renderList(navigation)
  }
}
