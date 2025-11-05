import SearchIndex from './search.js'
import path from 'node:path'

const QUIRE_FIGURE_CLASS = '.q-figure'
const SEARCH_INDEX_DIR = '_search'

/**
 * An Eleventy plugin for full-text search using Pagefind
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  collections     eleventy collections
 * @param      {Object}  options
 * @param      {boolean}  options.indexFigures
 *                        Configures if figures should be indexed separately
 * @param      {Array}  options.excludeSelectors
 *                        CSS selectors to exclude from search index
 * @param      {string}  options.searchIndexDir
 *                        The directory name for outputing the search index
 *
 */
export default function (eleventyConfig, collections, {
  indexFigures = false,
  excludeSelectors = [],
  searchIndexDir = SEARCH_INDEX_DIR
} = {}) {
  eleventyConfig.on('eleventy.after', async ({ results }) => {
    const { outputDir, publicDir } = eleventyConfig.globalData.directoryConfig

    /**
     * Add figures to the excluded selectors if indexing them separately.
     */
    if (indexFigures) {
      excludeSelectors = excludeSelectors ? [QUIRE_FIGURE_CLASS] : excludeSelectors.push(QUIRE_FIGURE_CLASS)
    }

    /**
     * Create a new search index for each build.
     */
    const index = new SearchIndex(eleventyConfig, {
      excludeSelectors
    })
    await index.create()

    /**
     * Adds each results HTML content to the search index.
     */
    await Promise.all(results.map(async ({ url, content }) => {
      await index.addPageRecord({ url, content })
    }))

    /**
     * Add figures from each page to the search index.
     */
    if (indexFigures) {
      await Promise.all(collections.html.map(async ({ data }) => {
        await index.addFiguresFromPage(data)
      }))
    }

    /**
     * Output the search index and compiled pagefind.js library to a _search directory.
     */
    const outputPath = path.join(publicDir || outputDir, searchIndexDir)
    await index.write(outputPath)
    await index.close()
  })
}
