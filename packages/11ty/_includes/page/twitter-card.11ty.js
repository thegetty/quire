const path = require('path')

/**
 * Renders <head> <meta> data tags for Open Graph protocol data
 *
 * @param      {Object}  data    data
 * @return     {String}  HTML meta and link elements
 */
module.exports = class TwitterCard {
  data() {
    const { description, promo_image } = publication
    const pageType = this.page.type

    const imagePath = () => {
      if (pageType !== 'essay' ) {
        return path.join(site.baseURL, site.imageDir, promo_image)
      } else {
        const image = page.cover || promo_image
        path.join(site.baseURL, site.imageDir, site.figureSubDir, image)
      }
    }

    const meta: [
      {
        name: 'twitter:card',
        content: summary_large_image
      },
      {
        name: 'twitter:site',
        content: pageType !== 'essay' ? site.baseURL : permalink
      },
      {
        name: 'twitter:title',
        content: pageType !== 'essay' ? site.title : page.title
      },
      {
        name: 'twitter:description',
        content: pageType !== 'essay'
          ? description.one_line || description.full
          : page.abstract || description.one_line || description.full
      },
      {
        name: 'twitter:image',
        content: imagePath()
      }
    ]
  }

  render({ link, meta }) {
    const metaTags = meta.map(({ name, content }) => (
      `<meta name="${name}" content="${content}">`
    ))
    return `${metaTags.join('\n')}`
  }
}
