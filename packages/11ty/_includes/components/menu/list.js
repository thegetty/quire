const { html } = require('~lib/common-tags')

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
    const { currentURL, navigation } = params

    const renderList = (items) => {
      return html`
        <ol>
          ${items.map((page) => {
            let listItem = ''
            if (!page.children || page.children.length === 0) {
              return `<li class="page-item">${menuItem({ currentURL, page })}</li>`
            } else {
              listItem += `<li class="section-item">${menuItem({ currentURL, page })}`
              if (config.params.menuType !== 'brief') {
                listItem += renderList(page.children)
              }
              listItem += '</li>'
              return listItem
            }}).join('')
          }
        </ol>
      `
    }

    return renderList(navigation)
  }
}
