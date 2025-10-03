import * as pagefind from 'pagefind'
import path from 'path'

/**
 * An Eleventy plugin for full-text search using Pagefind
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  collections     eleventy collections
 */
export default function (eleventyConfig, collections) {
  eleventyConfig.on('eleventy.after', async ({ results }) => {
    const { outputDir, publicDir } = eleventyConfig.globalData.directoryConfig
    const pageTitle = eleventyConfig.getFilter('pageTitle')

    /**
     * Creates a new search index.
     *
     * @returns {Promise<void>}
     */
    const { index } = await pagefind.createIndex({
      excludeSelectors: ['.q-figure']
    })

    /**
     * Returns the served asset location for this image
     * accounting for fully qualified asset URLs
     */
    const assetSrc = (srcPath) => {
      const regexp = /^(https?:\/\/|\/iiif\/|\\iiif\\)/
      const { imageDir } = eleventyConfig.globalData.config.figures
      return regexp.test(srcPath) ? srcPath : `${imageDir}/${srcPath}`
    }

    /**
     * Adds figures to the search index as non-HTML records,
     * with their own metadata and links.
     *
     * @param {Object} figure
     * @param {Object} figure.figureData
     * @param {Object} figure.page
     * @param {string} figure.language
     * @returns {Promise<void>}
     */
    const addFigureRecord = async ({ figureData, page, language } = {}) => {
      const { id, caption, alt, src, thumbnail, label, credit, mediaType } = figureData
      const { canonicalURL } = page.data
      if (!label || !caption) {
        return
      }
      await index.addCustomRecord({
        url: canonicalURL + '#' + id,
        content: caption.replaceAll('*', ''),
        meta: {
          title: label,
          pageTitle: pageTitle(page.data),
          image: thumbnail || assetSrc(src),
          image_alt: alt,
          credit,
          type: mediaType
        },
        language
      })
    }

    /**
     * Adds a HTML page results to the search index.
     *
     * Pages that have search: false set in the page yaml will be skipped.
     *
     * @param {Object} result
     * @param {string} result.url
     * @param {string} result.content
     * @returns {Promise<void>}
     */
    await Promise.all(results.map(async ({ url, content }) => {
      const page = collections.html.find(({ url: pageUrl }) => url === pageUrl)
      if (page.data.search === false) {
        return
      }
      await index.addHTMLFile({
        url,
        content
      })
    }))

    /**
     * Add figures from each page to the search index.
     *
     * @param {Object} htmlPage
     * @param {Object} htmlPage.data
     * @returns {Promise<void>}
     */
    await Promise.all(collections.html.map(async ({ data }) => {
      const { page, publication, search } = data
      const language = publication.language || 'en'
      if (search === false || !page.figures) {
        return
      }
      await Promise.all(page.figures.map(async (figureData) => {
        await addFigureRecord({ figureData, page, language })
      }))
    }))

    await index.writeFiles({
      outputPath: path.join(publicDir || outputDir, '_search')
    })

    await pagefind.close()
  })
}
