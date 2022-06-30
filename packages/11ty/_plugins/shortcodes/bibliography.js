const { html } = require('common-tags')

/**
 * Publication bibliography
 * @param      {Object}  eleventyConfig
 */
module.exports = function (eleventyConfig, { page }) {
  const markdownify = eleventyConfig.getFilter('markdownify')
  const slugify = eleventyConfig.getFilter('slugify')
  const sortReferences = eleventyConfig.getFilter('sortReferences')
  const { entries: allReferences } = eleventyConfig.globalData.references
  const { biblioHeading, displayBiblioShort } = eleventyConfig.globalData.config.params

  /**
   * @property  {Array}  citations  computed data citations array
   */
  return function (pageReferenceIds) {
    if (
      !page.citations ||
      !page.citations.length ||
      !pageReferenceIds ||
      !pageReferenceIds.length
    ) return;

    const frontMatterCitations = []
    allReferences.forEach((reference) => {
      if (pageReferenceIds.includes(reference.id)) frontMatterCitations.push(reference);
    })

    const citations = [...page.citations, ...frontMatterCitations].map((citation) => {
      return {
        ...citation,
        short: citation.short || citation.id
      }
    })

    const references = sortReferences(citations)

    const heading = biblioHeading
      ? `<h2 id="${slugify(biblioHeading)}">${biblioHeading}</h2>`
      : ''

    const definitionList = html`
      <dl>
        ${references.map((citation) => `
          <dt><span id="${slugify(citation.id)}">${markdownify(citation.short)}</span></dt>
          <dd>${markdownify(citation.full)}</dd>
          `
        )}
      </dl>
    `

    const unorderedList = `
      <ul>
        ${references.map((citation) => `<li id="${slugify(citation.id)}">${markdownify(citation.full)}</li>`
        ).join('')}
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
