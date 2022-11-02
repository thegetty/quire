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

    const listItem = (page) => {
      let element = ''
      if (!page.children || page.children.length === 0) {
        return `<li class="page-item">${menuItem({ currentURL, page })}</li>`
      } else {
        element += `<li class="section-item">${menuItem({ currentURL, page })}`
        if (config.params.menuType !== 'brief') {
          listItem += renderList(page.children)
        }
        element += '</li>'
        return element
      }
    }

    const renderList = (items) => {
      return html`
        <ol>
          ${items.map((page) => listItem(page)).join('')}
        </ol>
      `
    }

    return renderList(navigation)
  }
}
