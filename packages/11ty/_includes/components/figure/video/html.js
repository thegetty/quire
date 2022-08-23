const { html } = require('~lib/common-tags')
const chalkFactory = require('~lib/chalk')
const path = require('path')

const { warn, error } = chalkFactory('Figure Video')

const videoElement = {
  video({ id, poster='', src }) {
    if (!src) {
      error(`Cannot render Video without 'src'. Check that figures data for id: ${id} has a valid 'src'`)
      return ''
    }

    if (!poster) {
      warn(`figure "${id}" does not have a 'poster' property. It will not render a poster image`)
    }

    const unsupported = 'Sorry, your browser does not support embedded videos.'
    return html`
      <video controls poster="${poster}" class="q-figure__media">
        <source src="${src}" type="video/mp4"/>
        ${unsupported}
      </video>
    `
  },
  vimeo({ mediaId }) {
    if (!mediaId) {
      console.warn(`Error: Cannot render Vimeo embed without 'media_id'. Check that figures data for id: ${id} has a valid 'media_id'`)
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
  youtube({ mediaId }) {
    if (!mediaId) {
      console.warn(`Error: Cannot render Youtube component without 'media_id'. Check that figures data for id: ${id} has a valid 'media_id'`)
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

/**
 * A shortcode for embedding a media player that supports video playback into the document.
 * @param {String} src  Source url for the video
 * @return {String}  An HTML <video> element
 */
module.exports = function(eleventyConfig) {
  const figureCaption = eleventyConfig.getFilter('figureCaption')
  const figureLabel = eleventyConfig.getFilter('figureLabel')

  const { figureLabelLocation, imageDir } = eleventyConfig.globalData.config.params

  return function({ aspect_ratio: aspectRatio, caption, credit, id, label, media_id: mediaId, media_type: mediaType, src }) {
    if (src) {
      src = src.startsWith('http') ? src : path.join(imageDir, src)
    }

    const isEmbed = mediaType === 'vimeo' || mediaType === 'youtube'

    return html`
      <div class="q-figure__media-wrapper ${isEmbed && 'q-figure__media-wrapper--' + (aspectRatio || 'widescreen')}">
        ${videoElement[mediaType]({ mediaId, src })}
        ${label && figureLabelLocation === 'on-top' ? figureLabel({ caption, id, label }) : ''}
      </div>
      ${figureCaption({ caption, credit })}
    `
  }
}
