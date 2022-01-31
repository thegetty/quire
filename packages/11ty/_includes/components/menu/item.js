/**
 * Renders a menu item
 *
 * @param  {Object} context
 * @param  {String} page - The menu item's page data
 *
 * @return {String} Menu item markup
 */
module.exports = function({ globalData }, page) {
  const { config } = globalData
  let pageTitle = page.data.label ? page.data.label+config.params.pageLabelDivider : ''
  pageTitle += page.data.short_title || page.data.title
  return `      
    <a href="${page.url}">${pageTitle}</a>
  `
}
