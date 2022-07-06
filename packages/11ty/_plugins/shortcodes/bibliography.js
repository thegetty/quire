const { html } = require('common-tags')

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
   * @property  {Array}  citations  computed data citations array
   */
  return function (frontMatterReferences) {
    if (!page.citations && !frontMatterReferences) return

    frontMatterReferences.forEach((id) => {
      const entry = entries.find((entry) => entry.id === id)
      page.citations[id] ??= { full: entry.full, short: entry.id }
    })

    const bibliographyItems = sortReferences(Object.entries(page.citations))

    if (!citations) return;

    const heading = biblioHeading
      ? `<h2 id="${slugify(biblioHeading)}">${biblioHeading}</h2>`
      : ''

    const definitionList = html`
      <dl>
        ${bibliographyItems.map(([id, { short, full }]) => `
          <dt id="${slugify(id)}">${markdownify(short)}</dt>
          <dd>${markdownify(full)}</dd>
        `)}
      </dl>
    `

    const unorderedList = html`
      <ul>
        ${bibliographyItems.map(([id, { short, full }]) => `
          <li id="${slugify(id)}">${markdownify(full)}</li>
        `)}
      </ul>
    `

    return html`
      <div class="quire-page__content__references backmatter">
        ${heading}
        ${displayBiblioShort ? definitionList : unorderedList}
      </div>
    `
  }
}
