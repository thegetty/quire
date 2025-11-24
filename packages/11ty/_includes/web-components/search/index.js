import { LitElement, html } from 'lit'
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js'
import { searchResultsListStyles } from './styles.js'

/**
 * @type {Object|null} Global reference to Pagefind search functionality
 * Lazily loaded when search is first performed
 */
let PAGEFIND_GLOBAL

/**
 * @class SearchResultsList
 * @extends LitElement
 * @description A reactive Lit element for displaying and interacting with pagefind search results.
 * Handles search queries, result fetching, and rendering of structured search results with metadata.
 *
 * @property {string} query - The current search query string
 * @property {Array<Object>} results - Array of search result objects from Pagefind (internal state, not reflected as attribute)
 */
class SearchResultsList extends LitElement {
  static properties = {
    query: { type: String },
    results: { type: Array, attribute: false }
  }

  static styles = [searchResultsListStyles]

  constructor () {
    super()
    this.results = []
    this.query = ''
  }

  connectedCallback () {
    super.connectedCallback()
  }

  willUpdate (changedProperties) {
    if (changedProperties.has('query')) {
      this.updateResults(this.query)
    }
  }

  /**
   * updateResults
   * @description Performs search using Pagefind and updates the results array.
   * @param {string} [query=this.query] - The search query string to execute
   * @returns {Promise<void>} Promise that resolves when results are updated
   */
  async updateResults (query = this.query) {
    if (!PAGEFIND_GLOBAL) {
      PAGEFIND_GLOBAL = await import('../../../_search/pagefind.js')
    }
    const search = await PAGEFIND_GLOBAL.debouncedSearch(query)
    if (!search) return

    const resultsData = search.results.map(async rawResult => rawResult.data())
    this.results = await Promise.all(resultsData)
  }

  /**
   * resultHeaderTemplate
   * @description Renders the header section of a search result with title and link
   * @param {Object} result - Search result object from Pagefind
   * @returns {TemplateResult} Lit HTML template for the result header
   */
  resultHeaderTemplate (result) {
    return html`
      <div class="result-title">
        <a class="result-link" href="${result.url}" @click="${window.toggleSearch}">
          ${result.meta.title}
        </a>
      </div>
    `
  }

  /**
   * resultContentTemplate
   * @description Renders the main content section of a search result including image, metadata, and excerpt
   * @param {Object} result - Search result object from Pagefind
   * @returns {TemplateResult} Lit HTML template for the result content
   */
  resultContentTemplate (result) {
    return html`
      <div class="result-item">
        ${this.resultImageTemplate(result)}
        <div class="result-item-content">
          ${this.resultMetaTemplate(result)}
          <p class="result-excerpt">${unsafeHTML(result.excerpt)}</p>
        </div>
      </div>
    `
  }

  /**
   * resultImageTemplate
   * @description Renders the image section for a search result if an image is available
   * @param {Object} result - Search result object from Pagefind
   * @param {Object} result.meta - Metadata object
   * @returns {TemplateResult|string} Lit HTML template for the image or empty string if no image
   */
  resultImageTemplate (result) {
    if (!result.meta.image) return ''
    return html`
      <div class="result-item-image">
        <img src="${result.meta.image}" alt="${result.meta.image_alt}">
      </div>
    `
  }

  /**
   * subResultsTemplate
   * @description Renders sub-results for a search result and filters out sub-results are repeated.
   * @param {Object} [params={}]
   * @param {Array<Object>} [params.sub_results] - Array of sub-result objects
   * @param {Object} [params.meta]
   * @returns {TemplateResult|string} Lit HTML template for sub-results or empty string if none
   */
  subResultsTemplate ({ sub_results: subresults, meta } = {}) {
    const filteredResults = (subresults).filter(subitem => subitem.title !== meta.title)
    if (filteredResults.length === 0) return ''
    return html`
      <ol class="search-subresults">
        ${filteredResults.map(subitem => html`
          <li class="subresults-item">
            <a class="result-link" href="${subitem.url}" @click="${window.toggleSearch}">
              ${subitem.title}
            </a>
            <p class="result-excerpt">${unsafeHTML(subitem.excerpt)}</p>
          </li>
        `)}
      </ol>
    `
  }

  /**
   * resultMetaTemplate
   * @description Renders metadata information for a search result including page title, contributors, and credits
   * @param {Object} result - Search result object from Pagefind
   * @param {Object} result.meta - Metadata object
   * @param {string} [result.meta.pageTitle] - Page title metadata
   * @param {string} [result.meta.contributors] - Contributors metadata
   * @param {string} [result.meta.credit] - Credit metadata
   * @returns {TemplateResult} Lit HTML template for the result metadata
   */
  resultMetaTemplate (result) {
    return html`
      ${result.meta.pageTitle ? html`<p class="result-meta">${result.meta.pageTitle}</p>` : ''}
      ${result.meta.contributors ? html`<p class="result-meta">${result.meta.contributors}</p>` : ''}
      ${result.meta.credit ? html`<p class="result-meta">${result.meta.credit}</p>` : ''}
    `
  }

  /**
   * resultTemplate
   * @description Renders a complete search result item by combining header, content, and sub-results
   * @param {Object} result - Search result object from Pagefind
   * @returns {TemplateResult} Lit HTML template for the complete result item
   */
  resultTemplate (result) {
    return html`
    <li class="search-result">
      ${this.resultHeaderTemplate(result)}
      ${this.resultContentTemplate(result)}
      ${this.subResultsTemplate(result)}
    </li>`
  }

  render () {
    return html`<ol class="search-list">
      ${this.results.map(result => this.resultTemplate(result))}
    </ol>`
  }
}

customElements.define('q-search-results-list', SearchResultsList)
