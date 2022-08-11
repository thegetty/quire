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
  const canvasPanel = eleventyConfig.getFilter('canvasPanel')
  const figurecaption = eleventyConfig.getFilter('figurecaption')
  const figurechoices = eleventyConfig.getFilter('figurechoices')
  const figurelabel = eleventyConfig.getFilter('figurelabel')
  const figuremodallink = eleventyConfig.getFilter('figuremodallink')
  const imageService = eleventyConfig.getFilter('imageService')
  const markdownify = eleventyConfig.getFilter('markdownify')

  const { imageDir, figureLabelLocation } = eleventyConfig.globalData.config.params

  return function(figure) {
    const { 
      alt='', 
      caption,
      credit,
      id,
      iiif,
      label,
      src='' 
    } = figure
    const labelElement = figurelabel({ caption, id, label })

    let choicesElement='', imageElement;

    switch (true) {
      case !!iiif.canvas:
        imageElement = canvasPanel(figure)
        choicesElement = figurechoices(figure)
        break;
      case !!iiif.info:
        imageElement = imageService(figure)
        break;
      default:
        const imageSrc = src.startsWith('http') ? src : path.join(imageDir, src)
        imageElement = `<img alt="${alt}" class="q-figure__image" src="${imageSrc}" />`
        break
    }

    /**
     * Wrap image in modal link
     */
    imageElement =
      (figureLabelLocation === 'below')
        ? figuremodallink({ content: imageElement, id })
        : figuremodallink({ caption, content: imageElement + labelElement, id })

    const captionElement =
      (figureLabelLocation === 'below')
        ? figurecaption({ caption, content: labelElement, credit })
        : figurecaption({ caption, credit })

    return html`
      ${imageElement}
      ${choicesElement}
      ${captionElement}
    `
  }
}
