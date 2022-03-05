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
  const figurecaption = eleventyConfig.getFilter('figurecaption')
  const figurelabel = eleventyConfig.getFilter('figurelabel')
  const figuremodallink = eleventyConfig.getFilter('figuremodallink')
  const markdownify = eleventyConfig.getFilter('markdownify')

  const { imageDir, figureLabelLocation } = globalData.config.params

  return function({ figure }) {
    const { alt='', caption, id, src='' } = figure

    const imageSrc = path.join(imageDir, src)
    const labelElement = figurelabel({ figure })
    const imageElement = `<img alt="${alt}" class="q-figure__image" src="${imageSrc}"/>`

    const imagePreviewElement =
      (figureLabelLocation === 'on-top')
        ? figuremodallink({ figure, content: imageElement + figurelabel({ figure }) })
        : imageElement

    const imageCaptionElement = (figureLabelLocation === 'below')
      ? figurecaption({ figure, content: labelElement })
      : figurecaption({ figure })

    return html`
      <figure
        id="deepzoom-${id}"
        title="${caption}"
        class="quire-figure leaflet-outer-wrapper mfp-hide notGet"
      >
        <div
          id="js-deepzoom-${id}"
          class="quire-deepzoom inset leaflet-inner-wrapper "
          aria-label="Zoomable image"
          aria-live="polite"
          role="application"
          src="${imageSrc}"
        />
      </figure>
      ${imagePreviewElement}
      ${imageCaptionElement}
    `
  }
}
