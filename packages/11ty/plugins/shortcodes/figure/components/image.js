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
  const { config } = globalData
  const markdownify = eleventyConfig.getFilter('markdownify')
  const qfigurecaption = eleventyConfig.getFilter('qfigurecaption')
  const qfigurelabel = eleventyConfig.getFilter('qfigurelabel')
  const qfiguremodallink = eleventyConfig.getFilter('qfiguremodallink')

  return function(params) {
    const { figure } = params
    const { alt='', caption, id, src='' } = figure

    const imageSrc = path.join('/_assets/img', src)
    const labelElement = qfigurelabel({ figure })
    const imageElement = `<img alt="${alt}" class="q-figure__image" src="${imageSrc}"/>`

    const imagePreviewElement =
      (config.params.figureLabelLocation === 'on-top')
        ? qfiguremodallink({ figure, content: imageElement + qfigurelabel({ figure }) })
        : imageElement

    const imageCaptionElement = (config.params.figureLabelLocation === 'below') 
      ? qfigurecaption({ figure, content: labelElement }) 
      : qfigurecaption({ figure })

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
