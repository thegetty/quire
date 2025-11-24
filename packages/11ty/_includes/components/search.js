import { html } from '#lib/common-tags/index.js'

/**
 * Search Input
 *
 * @param  {EleventyConfig} eleventyConfig
 * @return {String} HTML tags
 */
export default function (eleventyConfig) {
  const icon = eleventyConfig.getFilter('icon')
  return (params) => {
    return html`
      <div
        aria-expanded="false"
        class="quire-search"
        id="js-search"
      >
        <div class="quire-search__close-button">
          <button class="button is-medium" onclick="toggleSearch()">
            ${icon({ type: 'close', description: 'Close search window' })}
          </button>
        </div>
        <div aria-label="search results" class="quire-search__inner">
          <section class="hero">
            <div class="hero-body">
              <div class="container">
              <div class="input-bar">
                <input
                  class="input is-large"
                  id="js-search-input"
                  name="search"
                  oninput="search()"
                  placeholder="Search this publication"
                  type="search"
                  value=""
                />
                <span>${icon({ type: 'search', description: 'Search' })}</span>
              </div>
                <q-search-results-list id="js-search-results-list"></q-search-results-list>
              </div>
            </div>
          </section>
        </div>
      </div>
    `
  }
}
