const { oneLine } = require('common-tags')

/**
 * A shortcode for the Quire project or publication title,
 * currently used for the Quire cover template.
 */
module.exports = function(eleventyConfig, globalData) {
  const markdownify = eleventyConfig.getFilter('markdownify')
  const { publication } = globalData

  return function() {
    const seperator = publication.title.slice(-1).match(/[a-zA-Z]/)
      ? `<span class="visually-hidden">:</span>`
      : ''

    const subtitle = publication.subtitle
      ? `<span class="subtitle">${markdownify(publication.subtitle)}</span>`
      : ''

    return oneLine`
      <span>${markdownify(publication.title)}</span>${seperator}${subtitle}
    `
  }
}
