const { html } = require('common-tags')

/**
 * Publication bibliography
 * @param      {Object}  eleventyConfig
 */
module.exports = function (eleventyConfig, { page }) {
  const biblioHeading = eleventyConfig.globalData.config.params.biblioHeading
  const displayBiblioShort = eleventyConfig.globalData.config.params.displayBiblioShort
  const markdownify = eleventyConfig.getFilter('markdownify')
  const slugify = eleventyConfig.getFilter('slugify')

  /**
   * @property  {Array}  citations  computed data citations array
   */
  return function () {
    if (!page.citations || !page.citations.length) return;

    const heading = biblioHeading
      ? `<h2 id="${slugify(biblioHeading)}">${biblioHeading}</h2>`
      : ''

    const definitionList = html`
      <dl>
        ${page.citations.map((citation) => `
          <dt><span id="${slugify(citation.id)}">${markdownify(citation.short)}</span></dt>
          <dd>${markdownify(citation.full)}</dd>
          `
        )}
      </dl>
    `

    const unorderedList = `
      <ul>
        ${page.citations.map((citation) => `<li id="${slugify(citation.id)}">${markdownify(citation.full)}</li>`
        )}
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
