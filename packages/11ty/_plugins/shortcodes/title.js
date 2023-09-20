const { oneLine } = require('~lib/common-tags')

/**
 * A shortcode for the Quire project or publication title,
 * currently used for the Quire cover template.
 */
module.exports = function(eleventyConfig) {
  const markdownify = eleventyConfig.getFilter('markdownify')
  const { subtitle, title } = eleventyConfig.globalData.publication

  return function(params) {
    const separator = title.slice(-1).match(/[a-zA-Z]/)
      ? `<span class="visually-hidden">:</span>`
      : ''

    const subtitleElement = subtitle
      ? `<span class="subtitle">${markdownify(subtitle)}</span>`
      : ''

    const titleElement = `<span class="title">${markdownify(title)}</span>`

    return oneLine`${titleElement}${separator}\u0020${subtitleElement}`
  }
}
