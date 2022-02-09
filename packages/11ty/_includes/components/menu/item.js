/**
 * Renders a menu item
 *
 * @param      {Object}  eleventyConfig
 * @param      {Object}  data
 */
module.exports = function(eleventyConfig, data) {
  const { config, page } = data

  let pageTitle = page.data.label ? page.data.label+config.params.pageLabelDivider : ''
  pageTitle += page.data.short_title || page.data.title

  return `<a href="${page.url}">${pageTitle}</a>`
}
