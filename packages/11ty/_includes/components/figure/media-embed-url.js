const chalkFactory = require('~lib/chalk')

const logger = chalkFactory('Figure Media Embed URL')

module.exports = function (eleventyConfig) {
  const embedUrlByMediaType = {
    soundcloud(mediaId) {
      const baseUrl = 'https://w.soundcloud.com/player/'
      const embedUrl = new URL(baseUrl)
      const embedParams = new URLSearchParams({
        auto_play: 'false',
        color: encodeURIComponent('#ff5500'),
        hide_related: 'true',
        show_comments: 'false',
        show_reposts: 'false',
        show_teaser: 'false',
        show_user: 'false',
        url: encodeURIComponent(`https://api.soundcloud.com/tracks/${mediaId}`)
      })
      embedUrl.search = `?${embedParams.toString()}`

      const sourceUrl = new URL(baseUrl)
      const sourceParams = new URLSearchParams({
        url: encodeURIComponent(`https://api.soundcloud.com/tracks/${mediaId}`)
      })
      sourceUrl.search = `?${sourceParams.toString()}`


      return {
        embedUrl: embedUrl.href,
        sourceUrl: sourceUrl.href
      }
    },
    vimeo(mediaId) {
      const baseUrl = 'https://player.vimeo.com/video/'
      const sourceBaseUrl = 'https://vimeo.com/'
      // Sample Vimeo id: 672853278/b3f8d29d53
      // or id: 672853278
      const embedId = mediaId.replace('/', '?h=')
      return {
        embedUrl: `${baseUrl}${embedId}`,
        sourceUrl: `${sourceBaseUrl}${mediaId}`
      }
    },
    youtube(mediaId) {
      const embedBaseUrl = 'https://www.youtube-nocookie.com/embed/'
      const sourceBaseUrl = 'https://youtu.be/'
      return {
        embedUrl: `${embedBaseUrl}${mediaId}`,
        sourceUrl: `${sourceBaseUrl}${mediaId}`
      }
    }
  }
  return function ({ mediaId, mediaType }) {
    if (!Object.keys(embedUrlByMediaType).includes(mediaType)) return ''

    return embedUrlByMediaType[mediaType](mediaId)
  }
}
