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
        mediaEmbedUrl: embedUrl.href,
        mediaSourceUrl: sourceUrl.href
      }
    },
    vimeo(mediaId) {
      const baseUrl = 'https://player.vimeo.com/video/'
      // Sample Vimeo id: 672853278/b3f8d29d53
      const embedId = mediaId.replace('/', '?h=')
      return {
        mediaEmbedUrl: `${baseUrl}${embedId}`,
        mediaSourceUrl: `${baseUrl}${embedId}`
      }
    },
    youtube(mediaId) {
      const embedBaseUrl = 'https://www.youtube-nocookie.com/embed/'
      const mediaSourceBaseUrl = 'https://www.youtube.com/watch?v='
      return {
        mediaEmbedUrl: `${embedBaseUrl}${mediaId}`,
        mediaSourceUrl: `${mediaSourceBaseUrl}${mediaId}`
      }
    }
  }
  return function ({ mediaId, mediaType }) {
    if (!Object.keys(embedUrlByMediaType).includes(mediaType)) return ''

    return embedUrlByMediaType[mediaType](mediaId)
  }
}
