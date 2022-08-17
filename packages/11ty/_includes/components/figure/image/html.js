const { html } = require('~lib/common-tags')
const path = require('path')

/**
 * Renders an <img> element
 *
 * @param      {Object} eleventyConfig  eleventy configuration
 * 
 * @return     {String}  An HTML <img> element
 */
module.exports = function(eleventyConfig) {
  const annotationsUI = eleventyConfig.getFilter('annotationsUI')
  const figurecaption = eleventyConfig.getFilter('figurecaption')
  const figureimageelement = eleventyConfig.getFilter('figureimageelement')
  const figurelabel = eleventyConfig.getFilter('figurelabel')
  const figuremodallink = eleventyConfig.getFilter('figuremodallink')
  const markdownify = eleventyConfig.getFilter('markdownify')

  const { imageDir, figureLabelLocation } = eleventyConfig.globalData.config.params

  return function(figure) {
    const { 
      caption,
      credit,
      id,
      isCanvas,
      label
    } = figure

    const labelElement = figurelabel({ caption, id, label })
    const annotationsElement = annotationsUI(figure)

    /**
     * Wrap image in modal link
     */
    const imageElement =
      (figureLabelLocation === 'below')
        ? figuremodallink({ content: figureimageelement(figure), id })
        : figuremodallink({ caption, content: figureimageelement(figure) + labelElement, id })

    const captionElement =
      (figureLabelLocation === 'below')
        ? figurecaption({ caption, content: labelElement, credit })
        : figurecaption({ caption, credit })

    return html`
      ${imageElement}
      ${annotationsElement}
      ${captionElement}
    `
  }
}
