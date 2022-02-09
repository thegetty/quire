const path = require('path')

/**
 * Renders <head> <meta> data tags for Twitter Cards
 *
 * @param      {Object}  eleventyConfig
 * @param      {Object}  data
 * 
 * @return     {String}  HTML meta and link elements
 */
module.exports = function(eleventyConfig, data) {
  const { abstract, config, cover, imageDir, layout, publication } = data

  const { description, promo_image } = publication
  const pageType = layout

  const imagePath = () => {
    if (!config.baseURL) return
    if (pageType !== 'essay' ) {
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
      content: pageType !== 'essay' ? config.baseURL : null
    },
    {
      name: 'twitter:title',
      content: pageType !== 'essay' ? config.title : null
    },
    {
      name: 'twitter:description',
      content: pageType !== 'essay'
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

