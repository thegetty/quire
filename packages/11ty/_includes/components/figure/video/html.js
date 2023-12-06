const { html } = require('~lib/common-tags')
/**
 * Renders a native or embedded video player with a caption
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  figure          The figure object
 *
 * @return     {String}  HTML containing a video player and a caption
 */
module.exports = function(eleventyConfig) {
  const figureVideoElement = eleventyConfig.getFilter('figureVideoElement')

  return function({
    aspect_ratio: aspectRatio,
    id,
    mediaId,
    mediaType,
    poster,
    src
  }) {
    const isEmbed = mediaType === 'vimeo' || mediaType === 'youtube'
    const videoElement = figureVideoElement({ id, mediaId, mediaType, src, poster })

    return html`
      <div class="q-figure__media-wrapper ${isEmbed && 'q-figure__media-wrapper--' + (aspectRatio || 'widescreen')}">
        ${videoElement}
      </div>
    `
  }
}
