const path = require('path')

/**
 * Global computed data
 */
module.exports = {
  canonicalURL: ({ config, page }) => path.join(config.baseURL, page.url),
  data: (data) => data,
  eleventyNavigation: {
    key: (data) => {
      const segments = data.page.url.split('/')
      const key = segments.slice(1, segments.length - 1).join('/')
      return data.key || key
    },
    order: (data) => data.order || data.weight,
    parent: (data) => {
      const segments = data.page.url.split('/')
      const parent = segments.slice(1, segments.length - 2).join('/')
      return data.parent || parent
    },
    title: (data) => data.title,
  },
  // imageDir: ({ config }) => path.join(config.baseURL, config.params.imageDir),
  imageDir: '/_assets/img/',
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
  pagination: ({ page, pages }) => {
    if (!page || !pages) return {}
    const currentPageIndex = pages.findIndex(({ url }) => url === page.url)
    return {
      currentPageIndex,
      nextPage: pages[currentPageIndex + 1],
      previousPage: pages[currentPageIndex - 1]
    }
  }
}
