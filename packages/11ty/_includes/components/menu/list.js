import { html } from '#lib/common-tags/index.js'

/**
 * Renders the menu list
 *
 * @param      {Object}  eleventyConfig
 * @param      {Object}  params
 */
export default function (eleventyConfig) {
  const menuItem = eleventyConfig.getFilter('menuItem')

  const { menuType } = eleventyConfig.globalData.config

  return function (params) {
    const { currentURL, navigation } = params

    const listItem = (page) => {
      let element = ''
      if (!page.children || page.children.length === 0) {
        return `<li class="page-item">${menuItem({ currentURL, page })}</li>`
      } else {
        element += `<li class="section-item">${menuItem({ currentURL, page })}`
        if (menuType !== 'brief') {
          element += renderList(page.children)
        }
        element += '</li>'
        return element
      }
    }

    const renderList = (items) => {
      return html`
        <ol>
          ${items.map(listItem).join('')}
        </ol>
      `
    }

    return renderList(navigation)
  }
}
