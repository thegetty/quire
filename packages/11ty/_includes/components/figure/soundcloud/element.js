const { html } = require('~lib/common-tags')
const chalkFactory = require('~lib/chalk')

const { error } = chalkFactory('Figure Video')

/**
 * Renders an embedded soundcloud audio player
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 *
 * @param      {Object}  figure          The figure object
 * @param      {String}  id              The id of the figure
 * @param      {String}  media_id        An id for a soundcloud embed
 *
 * @return     {String}  An embedded soundcloud player
 */
module.exports = function (eleventyConfig) {
  return function ({ id, media_id: mediaId }) {
    if (!mediaId) {
      error(`Cannot render SoundCloud component without 'media_id'. Check that figures data for id: ${id} has a valid 'media_id'`)
      return ''
    }

    const playerSrc = new URL('https://w.soundcloud.com/player/')
    const params = new URLSearchParams({
      url: encodeURIComponent(`https://api.soundcloud.com/tracks/${mediaId}`),
      auto_play: 'false',
      color: encodeURIComponent('#ff5500'),
      hide_related: 'true',
      show_comments: 'false',
      show_reposts: 'false',
      show_teaser: 'false',
      show_user: 'false'
    })
    playerSrc.search = `?${params.toString()}`

    return html`
      <iframe
        allow="autoplay"
        frameborder="no"
        height="166"
        scrolling="no"
        src="${playerSrc.href}"
        width="100%"
      ></iframe>
    `
  }
}
