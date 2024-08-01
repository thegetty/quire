const { html } = require('~lib/common-tags')
const chalkFactory = require('~lib/chalk')

const logger = chalkFactory('Figure Video')

/**
 * Renders an embedded soundcloud audio player
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 *
 * @param      {Object}  figure          The figure object
 * @param      {String}  id              The id of the figure
 * @param      {String}  mediaId         An id for a soundcloud embed
 * @param      {String}  mediaType       The type of tag video ('video', 'vimeo' or 'youtube')
 *
 * @return     {String}  An embedded soundcloud player
 */
module.exports = function (eleventyConfig) {
  const figureMediaEmbedUrl = eleventyConfig.getFilter('figureMediaEmbedUrl')
  const audioElements = {
    soundcloud({ id, mediaId, mediaType, lazyLoading }) {
      if (!mediaId) {
        logger.error(`Cannot render SoundCloud component without 'media_id'. Check that figures data for id: ${id} has a valid 'media_id'`)
        return ''
      }

      const { embedUrl } = figureMediaEmbedUrl({ mediaId, mediaType })

      return html`
        <iframe
          allow="autoplay"
          frameborder="no"
          loading="${ lazyLoading ?? 'lazy' }"
          height="166"
          scrolling="no"
          src="${embedUrl}"
          width="100%"
        ></iframe>
      `
    }
  }
  return function ({ id, mediaId, mediaType, lazyLoading }) {
    return audioElements[mediaType]({ id, mediaId, mediaType, lazyLoading })
  }
}
