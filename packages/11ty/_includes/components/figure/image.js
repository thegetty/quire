const { html } = require('common-tags')
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
  const figurelabel = eleventyConfig.getFilter('figurelabel')
  const figuremodallink = eleventyConfig.getFilter('figuremodallink')
  const markdownify = eleventyConfig.getFilter('markdownify')

  const { imageDir, figureLabelLocation } = eleventyConfig.globalData.config.params

  return async function({ alt='', canvasId, caption, choices, credit, id, iiifContent, label, manifestId, preset, src='' }) {
    const imageSrc = path.join(imageDir, src)
    const labelElement = figurelabel({ caption, id, label })
    const srcParts = src.split(path.sep)
    const hasTiles = srcParts[srcParts.length - 1] === 'tiles'
    const hasCanvasPanelProps = (!!canvasId && !!manifestId) || !!iiifContent || !!choices

    let imageElement;

    switch (true) {
      case hasCanvasPanelProps:
        imageElement = await canvasPanel({ canvasId, id, manifestId, preset })
        break;
      case hasTiles:
        imageElement = `<image-service alt="${alt}" class="q-figure__image" src="${imageSrc}" />`
        break;
      default:
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
      ${captionElement}
    `
  }
}
