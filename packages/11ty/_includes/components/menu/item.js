/**
 * Renders a menu item
 *
 * @param      {Object}  eleventyConfig
 * @param      {Object}  params
 * @property      {Object}  data Page data
 * @property      {String}  title Page title
 * @property      {String}  url Page url
 */
module.exports = function(eleventyConfig) {
  const pageTitle = eleventyConfig.getFilter('pageTitle')

  return function(params) {
    const { data, url } = params
    const { label, online, title } = data
    const item = pageTitle({ label, title })
    return online !== false ? `<a href="${url}">${item}</a>` : item
  }
}
