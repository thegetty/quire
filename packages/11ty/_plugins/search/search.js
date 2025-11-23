import * as pagefind from 'pagefind'
import path from 'node:path'

export default class SearchIndex {
  constructor (eleventyConfig, {
    excludeSelectors = []
  } = {}
  ) {
    this.eleventyConfig = eleventyConfig
    this.config = eleventyConfig.globalData.config
    this.publication = eleventyConfig.globalData.publication
    this.excludeSelectors = excludeSelectors
  }

  #index = null

  get index () {
    return this.#index
  }

  set index (index) {
    this.#index = index
  }

  /**
   * Creates a new pagefind index.
   *
   * @param {Array} excludeSelectors
   * @returns {Promise}
   */
  async create (excludeSelectors) {
    const { index } = await pagefind.createIndex({
      excludeSelectors: excludeSelectors || this.excludeSelectors
    })

    this.#index = index

    return index
  }

  /**
   * Outputs the pagefind index and library files.
   *
   * @param {string} outputPath
   * @returns {Promise<void>}
   */
  async write (outputPath) {
    await this.#index.writeFiles({
      outputPath
    })
  }

  /**
   * Disconnect the PageFind backend.
   */
  async close () {
    this.#index = null
    // We don't want to close the PageFind backend when running tests,
    // as test runs are parallel and will share the same PageFind backend.
    if (process.env.NODE_ENV === 'test') return
    await pagefind.close()
  }

  /**
   * Returns the served asset location for this image
   * accounting for fully qualified asset URLs
   *
   * @param {string} srcPath
   * @returns {string}
   */
  assetSrc (srcPath) {
    if (!srcPath) return null
    const regexp = /^(https?:\/\/|\/iiif\/|\\iiif\\)/
    const { imageDir } = this.config.figures
    return regexp.test(srcPath) ? srcPath : path.posix.join(imageDir, srcPath)
  }

  /**
   * Adds figures to the search index as non-HTML records,
   * with their own metadata and links.
   *
   * @param {Object} figure
   * @param {Object} figure.figureData
   * @param {Object} figure.canonicalURL
   * @param {Object} figure.title
   * @returns {Promise<void>}
   */
  async addFigureRecord ({ figureData, canonicalURL, title } = {}) {
    const { id, caption, alt, src, thumbnail, label, credit, mediaType } = figureData
    const markdownify = this.eleventyConfig.getFilter('markdownify')
    const removeHTML = this.eleventyConfig.getFilter('removeHTML')

    // Need to strip markdown and HTML tags for indexing
    const htmlContent = markdownify(caption)
    const content = removeHTML(htmlContent)

    if (!label || !caption) {
      return
    }
    await this.#index.addCustomRecord({
      url: canonicalURL + '#' + id,
      content,
      meta: {
        title: label,
        pageTitle: title,
        image: thumbnail || this.assetSrc(src) || '',
        image_alt: alt || '',
        credit,
        type: mediaType
      },
      language: this.publication.language || 'en'
    })
  }

  /**
   * Adds pages to the search index as HTML files.
   *
   * @param {Object} page
   * @param {string} page.url
   * @param {string} page.content
   * @returns {Promise<void>}
   */
  async addPageRecord ({ url, content } = {}) {
    await this.#index.addHTMLFile({
      url,
      content
    })
  }

  /**
   * Adds all figures in a page, if the page is searchable.
   *
   * @param {Object} pageData
   * @param {Object} pageData.page
   * @param {Object} pageData.search
   * @returns {Promise<void>}
   */
  async addFiguresFromPage (data) {
    if (!this.#index) await this.create()
    const { canonicalURL, page, search } = data
    if (search === false || !page.figures) {
      return
    }

    const pageTitle = this.eleventyConfig.getFilter('pageTitle')
    const title = pageTitle(data)
    await Promise.all(page.figures.map(async (figureData) => {
      await this.addFigureRecord({ figureData, canonicalURL, title })
    }))
  }
}
