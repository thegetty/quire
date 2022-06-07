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
    const { label, layout, title } = data
    const item = pageTitle({ label, title })
    /**
     * Check if item is a reference to a built page or just a heading
     * @type {Boolean}
     */
    const isPage = !!layout
    return isPage ? `<a href="${url}">${item}</a>` : item
  }
}
