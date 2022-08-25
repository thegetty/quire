const { html } = require('~lib/common-tags')
const chalkFactory = require('~lib/chalk')
const path = require('path')

const { warn } = chalkFactory('Figure Video')

/**
 * Renders an image instead of a video player
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  figure          The figure
 * @return     {String}  An HTML
 */
module.exports = function(eleventyConfig) {
  const figureCaption = eleventyConfig.getFilter('figureCaption')
  const figureLabel = eleventyConfig.getFilter('figureLabel')

  const { imageDir } = eleventyConfig.globalData.config.params

  return function({ aspect_ratio: aspectRatio, caption, credit, id, label, mediaType, poster=''}) {
    if (!poster) {
      warn(`Figure '${id}' does not have a 'poster' property. Print media will not render a fallback image for id: ${id}`)
    }

    const posterSrc = poster.startsWith('http')
      ? poster
      : path.join(imageDir, poster)
    const labelElement = figureLabel({ caption, id, label })
    const captionElement = figureCaption({ caption, content: labelElement,  credit })

    return html`
      <div class="q-figure__media-wrapper--${ aspectRatio || 'widescreen' }">
        <img src="${posterSrc}" />
      </div>
      ${captionElement}
    `
  }
}
