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
  const figureCaption = eleventyConfig.getFilter('figureCaption')
  const figureImageElement = eleventyConfig.getFilter('figureImageElement')
  const figureLabel = eleventyConfig.getFilter('figureLabel')
  const figureModalLink = eleventyConfig.getFilter('figureModalLink')
  const markdownify = eleventyConfig.getFilter('markdownify')

  const { imageDir } = eleventyConfig.globalData.config.params

  return function(figure) {
    const { 
      caption,
      credit,
      id,
      isCanvas,
      label
    } = figure

    const annotationsElement = annotationsUI(figure)
    const labelElement = figureLabel({ caption, id, label })

    /**
     * Wrap image in modal link
     */
    const imageElement = figureModalLink({ content: figureImageElement(figure), id })

    const captionElement = figureCaption({ caption, content: labelElement, credit })

    return html`
      ${imageElement}
      ${annotationsElement}
      ${captionElement}
    `
  }
}
