const { oneLine } = require('common-tags')

/**
 * A shortcode for the Quire project or publication title,
 * currently used for the Quire cover template.
 */
module.exports = function(eleventyConfig) {
  const markdownify = eleventyConfig.getFilter('markdownify')
  const { publication } = eleventyConfig.globalData

  return function(params) {
    const seperator = publication.title.slice(-1).match(/[a-zA-Z]/)
      ? `<span class="visually-hidden">:</span>`
      : ''

    const subtitle = publication.subtitle
      ? `<span class="subtitle">${markdownify(publication.subtitle)}</span>`
      : ''

    const title = `<span class="title">${markdownify(publication.title)}</span>`

    return oneLine`${title}${seperator}&#32;${subtitle}`
  }
}
