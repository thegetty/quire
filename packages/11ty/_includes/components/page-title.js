/**
 * Concatenates the page title and subtitle, using a colon, or if the title ends with a ! or ?, no colon is included.
 * See also site-title.js
 * 
 * @param {Object} eleventyConfig
 * @param {Object} params
 * @property {Object} label
 * @property {Object} subtitle
 * @property {Object} title
 *
 * @return {string} `page title: subtitle`
 */
module.exports = function(eleventyConfig) {
  const markdownify = eleventyConfig.getFilter('markdownify')

  const { labelDivider } = eleventyConfig.globalData.config.pageTitle

  return function(params) {

    const { label, subtitle, title } = params
    const separator = title && !title.match(/\?|!/) ? ': ' : ' '

    let pageTitle = subtitle ? [title, subtitle].join(separator) : title

    if (label) {
      pageTitle = `${[label, pageTitle].join(labelDivider)}`
    }

    return markdownify(pageTitle)
  }
}
