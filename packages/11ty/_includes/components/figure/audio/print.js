const { html } = require('~lib/common-tags')
const chalkFactory = require('~lib/chalk')
const path = require('path')

/**
 * Renders an iframe element with the SoundCloud audio player
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  figure          The figure
 *
 * @return     {String}  An embedded SoundCloud player and a caption
 */
module.exports = function(eleventyConfig) {
  const { imageDir } = eleventyConfig.globalData.config.figures

  const figureCaption = eleventyConfig.getFilter('figureCaption')
  const figureLabel = eleventyConfig.getFilter('figureLabel')

  return function({ caption, credit, id, label, mediaId, mediaType, poster='' }) {
    const labelElement = figureLabel({ caption, id, label })
    const captionElement = figureCaption({ caption, content: labelElement, credit, mediaId, mediaType })

    const posterSrc = poster.startsWith('http')
      ? poster
      : path.join(imageDir, poster)

    const imageElement = poster
      ? `<div class="q-figure__media-wrapper">
          <img src="${posterSrc}" />
        </div>`
      : ''

    return html`
      ${imageElement}
      ${captionElement}
    `
  }
}
