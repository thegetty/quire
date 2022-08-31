const { html } = require('~lib/common-tags')
const chalkFactory = require('~lib/chalk')
const path = require('path')

const { warn, error } = chalkFactory('Figure Video')

const videoElements = {
  video({ id, poster='', src }) {
    if (!src) {
      error(`Cannot render Video without 'src'. Check that figures data for id: ${id} has a valid 'src'`)
      return ''
    }

    if (!poster) {
      warn(`Figure '${id}' does not have a 'poster' property. A poster image for id: ${id} will not be rendered`)
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
  vimeo({ id, mediaId }) {
    if (!mediaId) {
      error(`Cannot render Vimeo embed without 'media_id'. Check that figures data for id: ${id} has a valid 'media_id'`)
      return ''
    }

    // Sample Vimeo id: 672853278/b3f8d29d53
    const embedId = mediaId.replace('/', '?h=')
    return html`
      <iframe
        allow="fullscreen; picture-in-picture"
        allowfullscreen
        class="q-figure-video-element q-figure-video-element--embed"
        frameborder="0"
        src="https://player.vimeo.com/video/${embedId}"
      ></iframe>
    `
  },
  youtube({ id, mediaId }) {
    if (!mediaId) {
      error(`Cannot render Youtube component without 'media_id'. Check that figures data for id: ${id} has a valid 'media_id'`)
      return ''
    }

    return html`
      <iframe
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        class="q-figure-video-element q-figure-video-element--embed"
        frameborder="0"
        src="https://www.youtube-nocookie.com/embed/${mediaId}"
      ></iframe>
    `
  }
}

/**
 * Renders a native or embedded video player
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 *
 * @param      {Object}  figure          The figure object
 * @param      {String}  id              The id of the figure
 * @param      {String}  media_id        An id for a youtube or vimeo embed
 * @param      {String}  media_type      The type of tag video ('video', 'vimeo' or 'youtube')
 * @param      {String}  poster          Poster image url for a static video file
 * @param      {String}  src             Source url for a static video file
 *
 * @return     {String}  An HTML <video> element
 */
module.exports = function (eleventyConfig) {
  const { imageDir } = eleventyConfig.globalData.config.params

  return function ({
    id,
    media_id: mediaId,
    media_type: mediaType,
    poster,
    src
  }) {
    if (poster) {
      poster = path.join(imageDir, poster)
    }
    if (src) {
      src = src.startsWith('http') ? src : path.join(imageDir, src)
    }

    return videoElements[mediaType]({ id, mediaId, poster, src })
  }
}
