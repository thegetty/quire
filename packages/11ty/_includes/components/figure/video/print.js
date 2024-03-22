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
  const { imageDir } = eleventyConfig.globalData.config.figures
  const figureMediaEmbedUrl = eleventyConfig.getFilter('figureMediaEmbedUrl')

  return function({
    aspect_ratio: aspectRatio,
    mediaId,
    mediaType,
    poster=''
  }) {
    const { sourceUrl } = figureMediaEmbedUrl({ mediaId, mediaType })
    const mediaSourceLink = sourceUrl
      ? `<span class="q-figure__caption-embed-link"><a href="${sourceUrl}"><em>${sourceUrl}</em></a></span>`
      : ''
    if (!poster) {
      logger.warn(`Figure '${id}' does not have a 'poster' property. Print media will not render a fallback image for id: ${id}`)
    }

    const posterSrc = poster.startsWith('http')
      ? poster
      : path.join(imageDir, poster)

    return html`
      <div class="q-figure__media-wrapper--${ aspectRatio || 'widescreen' }">
        <img src="${posterSrc}" />
        ${mediaSourceLink}
      </div>
    `
  }
}
