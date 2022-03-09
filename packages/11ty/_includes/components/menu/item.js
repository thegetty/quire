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
    const { canonicalURL, label, title } = page
    return `<a href="${canonicalURL}">${pageTitle({ label, title })}</a>`
  }
}
