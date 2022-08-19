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
  const figureCaption = eleventyConfig.getFilter('figurecaption')
  const figureImageElement = eleventyConfig.getFilter('figureImageElement')
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

    const annotationsElement = annotationsUI(figure)
    const labelElement = figurelabel({ caption, id, label })

    /**
     * Wrap image in modal link
     */
    const imageElement =
      (figureLabelLocation === 'below')
        ? figuremodallink({ content: figureImageElement(figure), id })
        : figuremodallink({ caption, content: figureImageElement(figure) + labelElement, id })

    const captionElement =
      (figureLabelLocation === 'below')
        ? figureCaption({ caption, content: labelElement, credit })
        : figureCaption({ caption, credit })

    return html`
      ${imageElement}
      ${annotationsElement}
      ${captionElement}
    `
  }
}
