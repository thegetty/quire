const { html } = require('~lib/common-tags')
const chalkFactory = require('~lib/chalk')
const path = require('path')

const logger = chalkFactory('Figure Video')

/**
 * Renders a native or embedded video player
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 *
 * @param      {Object}  figure          The figure object
 * @param      {String}  id              The id of the figure
 * @param      {String}  mediaId         An id for a youtube or vimeo embed
 * @param      {String}  mediaType       The type of tag video ('video', 'vimeo' or 'youtube')
 * @param      {String}  poster          Poster image url for a static video file
 * @param      {String}  src             Source url for a static video file
 *
 * @return     {String}  An HTML <video> element
 */
module.exports = function (eleventyConfig) {
  const { imageDir } = eleventyConfig.globalData.config.figures
  const figureMediaEmbedUrl = eleventyConfig.getFilter('figureMediaEmbedUrl')
  const videoElements = {
    video({ id, poster='', src }) {
      if (!src) {
        logger.error(`Cannot render Video without 'src'. Check that figures data for id: ${id} has a valid 'src'`)
        return ''
      }

      if (!poster) {
        logger.warn(`Figure '${id}' does not have a 'poster' property. A poster image for id: ${id} will not be rendered`)
      }

      const unsupported = 'Sorry, your browser does not support embedded videos.'
      return html`
        <video
          class="q-figure-video-element"
          controls
          poster="${poster}"
        >
          <source src="${src}" type="video/mp4"/>
          ${unsupported}
        </video>
      `
    },
    vimeo({ id, mediaId, mediaType, lazyLoading }) {
      if (!mediaId) {
        logger.error(`Cannot render Vimeo embed without 'media_id'. Check that figures data for id: ${id} has a valid 'media_id'`)
        return ''
      }

      const { embedUrl } = figureMediaEmbedUrl({ mediaId, mediaType })

      return html`
        <iframe
          allow="fullscreen; picture-in-picture"
          allowfullscreen
          class="q-figure-video-element q-figure-video-element--embed"
          frameborder="0"
          src="${embedUrl}"
          loading="${ lazyLoading ?? 'lazy' }"
        ></iframe>
      `
    },
    youtube({ id, mediaId, mediaType, lazyLoading }) {
      if (!mediaId) {
        logger.error(`Cannot render Youtube component without 'media_id'. Check that figures data for id: ${id} has a valid 'media_id'`)
        return ''
      }

      const { embedUrl } = figureMediaEmbedUrl({ mediaId, mediaType })

      return html`
        <iframe
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          class="q-figure-video-element q-figure-video-element--embed"
          frameborder="0"
          src="${embedUrl}"
          loading="${ lazyLoading ?? 'lazy' }"
        ></iframe>
      `
    }
  }

  return function ({
    id,
    mediaId,
    mediaType,
    poster,
    lazyLoading,
    src
  }) {
    if (poster) {
      poster = path.join(imageDir, poster)
    }
    if (src) {
      src = src.startsWith('http') ? src : path.join(imageDir, src)
    }

    return videoElements[mediaType]({ id, mediaId, mediaType, poster, lazyLoading, src })
  }
}
