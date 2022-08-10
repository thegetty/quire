const { html } = require('~lib/common-tags')
const path = require('path')
const imageElement = require('./elements')

/**
 * Renders an <img> element
 *
 * @param      {Object} eleventyConfig  eleventy configuration
 * 
 * @return     {String}  An HTML <img> element
 */
module.exports = function(eleventyConfig) {
  const figurecaption = eleventyConfig.getFilter('figurecaption')
  const figurelabel = eleventyConfig.getFilter('figurelabel')
  const figuremodallink = eleventyConfig.getFilter('figuremodallink')
  const markdownify = eleventyConfig.getFilter('markdownify')

  const { imageDir, figureLabelLocation } = eleventyConfig.globalData.config.params

  return function(figure) {
    const { 
      caption,
      credit,
      id,
      label,
    } = figure
    const labelElement = figurelabel({ caption, id, label })

    let choicesElement = ''
    let imageMarkup = imageElement(figure, imageDir)

    /**
     * Wrap image in modal link
     */
    imageMarkup =
      (figureLabelLocation === 'below')
        ? figuremodallink({ content: imageMarkup, id })
        : figuremodallink({ caption, content: imageMarkup + labelElement, id })

    const captionElement =
      (figureLabelLocation === 'below')
        ? figurecaption({ caption, content: labelElement, credit })
        : figurecaption({ caption, credit })

    return html`
      ${imageMarkup}
      ${choicesElement}
      ${captionElement}
    `
  }
}
