const path = require('path')
/**
 * Global computed data
 */
module.exports = {
  canonicalURL: ({ config, page }) => path.join(config.baseURL, page.url),
  data: (data) => data,
  // imageDir: ({ config }) => path.join(config.baseURL, config.params.imageDir),
  imageDir: '/_assets/img/',
  navigation: {
    id: (data) => data.title,
    parent: (data) => data.parent,
  },
  /**
   * Figures data for figures referenced by id in page frontmatter 
   */
  pageFigures: ({ figure, figures }) => {
    if (!figure || !figure.length) return
    return figure.map((figure) => figures.figure_list.find((item) => item.id === figure.id))
  },
  /**
   * Objects data referenced by id in page frontmatter including figures data
   */
  pageObjects: ({ figures, object, objects }) => {
    if (!object || !object.length) return
    return object
      .map((item) => {
        const objectData = objects.object_list.find(({ id }) => id === item.id)
        if (!objectData) {
          console.warn(`Error: eleventyComputed: pageObjects: no object found with id ${item.id}`)
          return
        }
        objectData.figures = objectData.figure.map((figure) => {
          if (figure.id) {
            return figures.figure_list.find((item) => item.id === figure.id)
          } else {
            return figure
          }
        })
        return objectData
      })
  },
  pages: ({ collections, config }) => {
    if (!collections.all) return [];
    return collections.all
      .filter(({ data }) => {
        const { epub, pdf, type, url } = data
        return (
          !(config.params.pdf && pdf === false) &&
          !(config.params.epub && epub === false) &&
          type !== 'data'
        )
      })
      .sort((a, b) => parseInt(a.data.weight) - parseInt(b.data.weight))
  },
}
