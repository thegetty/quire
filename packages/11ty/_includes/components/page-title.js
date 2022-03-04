/**
 * Concatenates the page title and subtitle, using a colon, or if the title ends with a ! or ?, no colon is included.
 * See also site-title.liquid
 * @param {Object} eleventyConfig
 * @param {Object} globalData
 * @param {Object} params
 * @param {Object} options
 * @property {Boolean} withLabel - if true, prepends title with page.label
 * @return {string} `page title: subtitle`
 */
module.exports = function(eleventyConfig, globalData) {
  const { config } = globalData
  return function(params) {
    const { withLabel, page } = params
    const { label, subtitle, title } = page

    const separator = title && !title.match(/\?|\!/) ? ': ' : ' '

    let pageTitle = subtitle ? [title, subtitle].join(separator) : title

    if (withLabel) {
      pageTitle = `${label}${config.params.pageLabelDivider} ${pageTitle}`
    }

    return pageTitle;
  }
}
