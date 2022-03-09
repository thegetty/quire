/**
 * Concatenates the page title and subtitle, using a colon, or if the title ends with a ! or ?, no colon is included.
 * See also site-title.js
 * 
 * @param {Object} eleventyConfig
 * @param {Object} globalData
 * @param {Object} params
 * @property {Object} label
 * @property {Object} subtitle
 * @property {Object} title
 *
 * @return {string} `page title: subtitle`
 */
module.exports = function(eleventyConfig, globalData) {
  const markdownify = eleventyConfig.getFilter('markdownify')

  const { pageLabelDivider } = globalData.config.params

  return function(params) {

    const { label, subtitle, title } = params
    const separator = title && !title.match(/\?|\!/) ? ': ' : ' '

    let pageTitle = subtitle ? [title, subtitle].join(separator) : title

    if (label) {
      pageTitle = `${[label, pageTitle].join(pageLabelDivider)}`
    }

    return markdownify(pageTitle)
  }
}
