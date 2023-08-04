const { html } = require('~lib/common-tags')
const chalkFactory = require('~lib/chalk')
const path = require('path')

const logger = chalkFactory('Figure Video')

/**
 * Renders an image fallback for a video player in print output
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  figure          The figure object
 *
 * @return     {String}  HTML containing a fallback image and a caption
 */
module.exports = function(eleventyConfig) {
  const figureCaption = eleventyConfig.getFilter('figureCaption')
  const figureLabel = eleventyConfig.getFilter('figureLabel')

  const { imageDir } = eleventyConfig.globalData.config.figures

  return function({
    aspect_ratio: aspectRatio,
    caption,
    credit,
    id,
    label,
    mediaId,
    mediaType,
    poster=''
  }) {
    if (!poster) {
      logger.warn(`Figure '${id}' does not have a 'poster' property. Print media will not render a fallback image for id: ${id}`)
    }

    const posterSrc = poster.startsWith('http')
      ? poster
      : path.join(imageDir, poster)
    const labelElement = figureLabel({ caption, id, label })
    const captionElement = figureCaption({ caption, content: labelElement,  credit, mediaId, mediaType })

    return html`
      <div class="q-figure__media-wrapper--${ aspectRatio || 'widescreen' }">
        <img src="${posterSrc}" />
      </div>
      ${captionElement}
    `
  }
}
