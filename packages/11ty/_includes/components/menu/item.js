/**
 * Renders a menu item
 *
 * @param      {Object}  eleventyConfig
 * @param      {Object}  data
 */
module.exports = function(eleventyConfig, params) {
  const pageTitle = eleventyConfig.getFilter('pageTitle')
  const { config, page } = params

  return `<a href="${page.url}">${pageTitle({ page })}</a>`
}
