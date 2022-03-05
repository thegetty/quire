/**
 * Renders a menu item
 *
 * @param      {Object}  eleventyConfig
 * @param      {Object}  globalData
 * @param      {Object}  params
 */
module.exports = function(eleventyConfig, globalData) {
  const pageTitle = eleventyConfig.getFilter('pageTitle')

  return function(params) {
    const { page } = params
    return `<a href="${page.canonicalURL}">${pageTitle({ page })}</a>`
  }
}
