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
  const isImageService = eleventyConfig.getFilter('isImageService')
  const hasCanvasPanelProps = eleventyConfig.getFilter('hasCanvasPanelProps')
  const markdownify = eleventyConfig.getFilter('markdownify')

  const { imageDir, figureLabelLocation } = eleventyConfig.globalData.config.params

  return async function(figure) {
    const { 
      alt='', 
      canvasId,
      caption,
      choices,
      credit,
      id,
      iiifContent,
      label,
      manifestId,
      media_type,
      preset,
      src='' 
    } = figure
    const labelElement = figurelabel({ caption, id, label })

    let choicesElement='', imageElement;

    switch (true) {
      case hasCanvasPanelProps(figure):
        imageElement = canvasPanel(figure)
        choicesElement = figurechoices(figure)
        break;
      case isImageService(figure):
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
      (figureLabelLocation === 'on-top')
        ? figuremodallink({ caption, content: imageElement + labelElement, id })
        : imageElement

    const captionElement = (figureLabelLocation === 'below')
      ? figurecaption({ caption, content: labelElement, credit })
      : figurecaption({ caption, credit })

    return html`
      ${imageElement}
      ${choicesElement}
      ${captionElement}
    `
  }
}
