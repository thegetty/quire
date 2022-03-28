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
  const slugify = eleventyConfig.getFilter('slugify')

  const { imageDir, figureLabelLocation } = globalData.config.params

  return function({ alt='', caption, credit, id, label, src='' }) {

    const imageSrc = path.join(imageDir, src)
    const labelElement = figurelabel({ caption, id, label })

    const figureElement = `
      <img
        alt="${alt}"
        id="${slugify(id)}"
        title="${caption}"
        class="q-figure__image"
        src="${imageSrc}"
      />
    `

    const imagePreviewElement =
      (figureLabelLocation === 'on-top')
        ? figuremodallink({ caption, content: figureElement + labelElement, id })
        : figureElement

    const imageCaptionElement = (figureLabelLocation === 'below')
      ? figurecaption({ caption, content: labelElement, credit })
      : figurecaption({ caption, credit })

    return html`
      ${imagePreviewElement}
      ${imageCaptionElement}
    `
  }
}
