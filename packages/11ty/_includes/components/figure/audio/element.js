import { html } from '#lib/common-tags/index.js'
import chalkFactory from '#lib/chalk/index.js'

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
export default function (eleventyConfig) {
  const audioElements = {
    soundcloud ({ id, derivatives, lazyLoading }) {
      const { embedUrl } = derivatives.embed
      if (!embedUrl) {
        logger.error(`Cannot render SoundCloud component without 'media_id'. Check that figures data for id: ${id} has a valid 'media_id'`)
        return ''
      }

      return html`
        <iframe
          allow="autoplay"
          frameborder="no"
          loading="${lazyLoading ?? 'lazy'}"
          height="166"
          scrolling="no"
          src="${embedUrl}"
          width="100%"
        ></iframe>
      `
    }
  }
  return function ({ derivatives, id, mediaId, mediaType, lazyLoading }) {
    console.log('sup', derivatives)
    return audioElements[mediaType]({ derivatives, id, mediaId, mediaType, lazyLoading })
  }
}
