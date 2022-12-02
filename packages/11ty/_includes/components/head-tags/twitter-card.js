const path = require('path')

/**
 * Renders <head> <meta> data tags for Twitter Cards
 *
 * @param      {Object}  eleventyConfig
 * @param      {Object}  globalData
 * 
 * @return     {String}  HTML meta and link elements
 */
module.exports = function(eleventyConfig) {
  const { config, publication } = eleventyConfig.globalData
  const { description, promo_image } = publication
  const { imageDir } = config.figures

  return function({ abstract, cover, layout }) {
    const imagePath = () => {
      if (!publication.url) return
      if (layout !== 'essay' ) {
        return promo_image && path.join(imageDir, promo_image)
      } else {
        const image = cover || promo_image
        return image && path.join(imageDir, image)
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
      `<meta name="${name}" content="${content}">`
    ))
    return `${metaTags.join('\n')}`
  }
}

