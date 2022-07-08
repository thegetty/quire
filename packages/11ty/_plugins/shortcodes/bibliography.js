const { html } = require('~lib/common-tags')

/**
 * Renders a bibliography of references from page citations.
 *
 * @param      {Object}  eleventyConfig
 */
module.exports = function (eleventyConfig, { page }) {
  const markdownify = eleventyConfig.getFilter('markdownify')
  const slugify = eleventyConfig.getFilter('slugify')
  const sortReferences = eleventyConfig.getFilter('sortReferences')

  const { biblioHeading, displayBiblioShort } = eleventyConfig.globalData.config.params
  const { entries } = eleventyConfig.globalData.references

  /**
   * bibliography shortcode
   * @example {% bibliography pageReferences %}
   *
   * Nota bene: the front matter property for additional page level references
   * is `pageReferences` to avoid conflicts with the global data `references.yaml`
   *
   * @param  {Array}  referenceIds  An array of `references.yaml` entry ids
   *                                to include in the rendered bibliography
   */
  return function (referenceIds = []) {
    if (!page.citations && !referenceIds) return

    /**
     * The page citations array is created when the `cite` shortcode is used;
     * ensure that it exists in cases where there are only page references.
     */
    page.citations ??= {}

    /**
     * Add `pageReferences` from template front-matter to the array of citations
     * for inclusion in the rendered page bibliography
     */
    referenceIds.forEach((id) => {
      const entry = entries.find((entry) => entry.id === id)
      if (entry) {
        page.citations[id] ??= { ...entry, short: entry.short || entry.id }
      }
    })

    const bibliographyItems = sortReferences(Object.values(page.citations))

    const heading = () => biblioHeading
      ? `<h2 id="${slugify(biblioHeading)}">${biblioHeading}</h2>`
      : ''

    const definitionList = () => html`
      <dl>
        ${bibliographyItems.map(({ id, short, full }) => `
          <dt id="${slugify(id)}">${markdownify(short)}</dt>
          <dd>${markdownify(full)}</dd>
        `)}
      </dl>
    `

    const unorderedList = () => html`
      <ul>
        ${bibliographyItems.map(({ id, short, full }) => `
          <li id="${slugify(id)}">${markdownify(full)}</li>
        `)}
      </ul>
    `

    /**
     * Do not render the list when there are no citations nor page references
     */
    return bibliographyItems.length
      ? html`
          <div class="quire-page__content__references backmatter">
            ${heading()}
            ${displayBiblioShort ? definitionList() : unorderedList()}
          </div>
        `
      : ''
  }
}
