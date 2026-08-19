/* eslint-disable camelcase */
import escape from 'html-escape'
import path from 'node:path'

/**
 * Renders <head> <meta> data tags for Twitter Cards
 *
 * @param      {Object}  eleventyConfig
 * @param      {Object}  globalData
 *
 * @return     {String}  HTML meta and link elements
 */
export default function (eleventyConfig) {
  const getFigureMedia = eleventyConfig.getFilter('getFigureMedia')
  const { config, publication } = eleventyConfig.globalData
  const { description } = publication
  const { imageDir } = config.figures

  return function ({ abstract, cover, layout }) {
    const promoFigure = getFigureMedia('promo-image')
    const imagePath = () => {
      if (!publication.url) return
      if (layout !== 'essay' || !cover) {
        return promoFigure.derivatives.full.paths.internal
      } else {
        return path.posix.join(imageDir, cover)
      }
    }

    const meta = [
      {
        name: 'twitter:card',
        content: 'summary_large_image'
      },
      {
        name: 'twitter:site',
        content: layout !== 'essay' ? publication.url : null
      },
      {
        name: 'twitter:title',
        content: publication.title
      },
      {
        name: 'twitter:description',
        content: layout !== 'essay'
          ? description.one_line || description.full
          : abstract || description.one_line || description.full
      },
      {
        name: 'twitter:image',
        content: imagePath()
      }
    ]

    const metaTags = meta.map(({ name, content }) => (
      `<meta name="${name}" content="${escape(content)}">`
    ))
    return `${metaTags.join('\n')}`
  }
}
