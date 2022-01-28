/**
 * Concatenates the page title and subtitle, using a colon, or if the title ends with a ! or ?, no colon is included.
 * See also site-title.liquid
 * @param {Object} eleventyConfig
 * @param {Object} globalData
 * @param {Object} page
 * @param {Object} options
 * @property {Boolean} withLabel - if true, prepends title with page.label
 * @return {string} `page title: subtitle`
 */
module.exports = function({ eleventyConfig, globalData }, page, options={}) {
  const { config } = globalData
  const { label, subtitle, title } = page.data
  const separator = title && !title.match(/\?|\!/) ? ': ' : ' '

  let pageTitle = subtitle ? [title, subtitle].join(separator) : title

  if (options.withLabel) {
    pageTitle = `${label}${config.params.pageLabelDivider} ${pageTitle}`
  }

  return pageTitle;
}
