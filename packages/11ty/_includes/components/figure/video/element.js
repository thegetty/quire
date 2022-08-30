const { html } = require('~lib/common-tags')
const chalkFactory = require('~lib/chalk')

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
      <video controls poster="${poster}" class="q-figure__media">
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
        class="q-figure__media q-figure__media--embed"
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
        class="q-figure__media q-figure__media--embed"
        frameborder="0"
        src="https://www.youtube-nocookie.com/embed/${mediaId}"
      ></iframe>
    `
  }
}

module.exports = function (eleventyConfig) {
  return function ({ id, media_id: mediaId, media_type: mediaType, poster, src }) {
    return videoElements[mediaType]({ id, mediaId, poster, src })
  }
}
