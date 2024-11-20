const { html } = require('~lib/common-tags')
const path = require('path')

/**
 * Renders an image with a caption in print output
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  figure          Figure data
 *
 * @return     {String}  HTML containing an <img> element and a caption
 */
module.exports = function(eleventyConfig) {
  const figureCaption = eleventyConfig.getFilter('figureCaption')
  const figureLabel = eleventyConfig.getFilter('figureLabel')

  const { imageDir } = eleventyConfig.globalData.config.figures

  return function(figure) {
    const { alt, caption, credit, id, label, src, staticInlineFigureImage } = figure

    if (!src && !staticInlineFigureImage) return ''

    const labelElement = figureLabel({ caption, id, label })

    let imageSrc

    switch (true) {
      case figure.isSequence:
        imageSrc = figure.staticInlineFigureImage
        break
      case figure.isCanvas || figure.isImageService:
        imageSrc = figure.printImage
        break
      default:
        imageSrc = src.startsWith('http')
          ? src
          : path.join(imageDir, src)
        break
    }

    return html`
      <img alt="${alt}" class="q-figure__image" src="${imageSrc}"/>
      ${figureCaption({ caption, content: labelElement, credit })}
    `
  }
}
