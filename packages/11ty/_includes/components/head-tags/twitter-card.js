const path = require('path')

/**
 * Renders <head> <meta> data tags for Twitter Cards
 *
 * @param      {Object}  eleventyConfig
 * @param      {Object}  globalData
 * 
 * @return     {String}  HTML meta and link elements
 */
module.exports = function(eleventyConfig, globalData) {
  const { config, publication } = globalData

  const { description, promo_image } = publication

  return function(params) {
    const { abstract, cover, imageDir, layout } = params

    const imagePath = () => {
      if (!config.baseURL) return
      if (layout !== 'essay' ) {
        return path.join(imageDir, promo_image)
      } else {
        const image = cover || promo_image
        return path.join(imageDir, image)
      }
    }

    const meta = [
      {
        name: 'twitter:card',
        content: 'summary_large_image'
      },
      {
        name: 'twitter:site',
        content: layout !== 'essay' ? config.baseURL : null
      },
      {
        name: 'twitter:title',
        content: layout !== 'essay' ? config.title : null
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

