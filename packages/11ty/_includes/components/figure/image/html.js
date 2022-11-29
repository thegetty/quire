const { html } = require('~lib/common-tags')
const path = require('path')

/**
 * Renders an image with a caption and annotations UI
 *
 * @param      {Object} eleventyConfig  eleventy configuration
 * @param      {Object} figure          The figure object
 * 
 * @return     {String}  HTML containing  a `figureImageElement`, a caption and annotations UI
 */
module.exports = function(eleventyConfig) {
  const annotationsUI = eleventyConfig.getFilter('annotationsUI')
  const figureCaption = eleventyConfig.getFilter('figureCaption')
  const figureImageElement = eleventyConfig.getFilter('figureImageElement')
  const figureLabel = eleventyConfig.getFilter('figureLabel')
  const figureModalLink = eleventyConfig.getFilter('figureModalLink')
  const markdownify = eleventyConfig.getFilter('markdownify')

  const { imageDir } = eleventyConfig.globalData.config.figures

  return function(figure) {
    const { 
      caption,
      credit,
      id,
      label
    } = figure

    const annotationsElement = annotationsUI({ figure })
    const labelElement = figureLabel({ id, label })

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
