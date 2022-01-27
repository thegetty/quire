/**
 * Concatenates the page title and subtitle, using a colon, or if the title ends with a ! or ?, no colon is included.
 * See also site-title.liquid
 * @return {string} `page title: subtitle`
 */
module.exports = function(eleventyConfig, globalData, page) {
  const { subtitle, title } = page.data
  const separator = title && !title.match(/\?|\!/) ? ': ' : ' '
  return subtitle ? [title, subtitle].join(separator) : title
}