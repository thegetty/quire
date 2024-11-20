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
  const figureCaption = eleventyConfig.getFilter('figureCaption')
  const figureLabel = eleventyConfig.getFilter('figureLabel')
  const figureVideoElement = eleventyConfig.getFilter('figureVideoElement')

  return function({
    aspect_ratio: aspectRatio,
    caption,
    credit,
    id,
    label,
    mediaId,
    mediaType,
    poster,
    src,
    lazyLoading
  }) {
    const isEmbed = mediaType === 'vimeo' || mediaType === 'youtube'
    const videoElement = figureVideoElement({ id, mediaId, mediaType, src, poster, lazyLoading })
    const labelElement = figureLabel({ caption, id, label })
    const captionElement = figureCaption({ caption, content: labelElement, credit })

    return html`
      <div class="q-figure__media-wrapper ${isEmbed && 'q-figure__media-wrapper--' + (aspectRatio || 'widescreen')}">
        ${videoElement}
      </div>
      ${captionElement}
    `
  }
}
