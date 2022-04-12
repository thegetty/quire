const { html } = require('common-tags')
const path = require('path')

/**
 * Renders an <img> element
 *
 * @param      {Object} eleventyConfig  eleventy configuration
 * @param      {Object} globalData
 * 
 * @return     {String}  An HTML <img> element
 */
module.exports = function(eleventyConfig, globalData) {
  const canvasPanel = eleventyConfig.getFilter('canvasPanel')
  const figurecaption = eleventyConfig.getFilter('figurecaption')
  const figurelabel = eleventyConfig.getFilter('figurelabel')
  const figuremodallink = eleventyConfig.getFilter('figuremodallink')
  const markdownify = eleventyConfig.getFilter('markdownify')

  const { imageDir, figureLabelLocation } = globalData.config.params

  return async function({ alt='', canvasId, caption, credit, id, iiifContent, label, manifestId, preset, src='' }) {
    const imageSrc = path.join(imageDir, src)
    const labelElement = figurelabel({ caption, id, label })
    const srcParts = src.split(path.sep)
    const hasTiles = srcParts[srcParts.length - 1] === 'tiles'
    const hasManifestAndCanvasIds = (!!canvasId && !!manifestId) || !!iiifContent

    let imageElement;

    switch (true) {
      case hasManifestAndCanvasIds:
        imageElement = await canvasPanel({ canvasId, id, manifestId, preset })
        break;
      case hasTiles:
        imageElement = `<image-service alt="${alt}" class="q-figure__image" src="${imageSrc}"></image-service>`
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
