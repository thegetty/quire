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

  return function () {
    const citations = page.citations && sortReferences(Object.entries(page.citations))

    if (!citations) return;

    const heading = biblioHeading
      ? `<h2 id="${slugify(biblioHeading)}">${biblioHeading}</h2>`
      : ''

    const definitionList = html`
      <dl>
        ${citations.map(([id, { short, full }]) => `
          <dt id="${slugify(id)}">${markdownify(short)}</dt>
          <dd>${markdownify(full)}</dd>
        `)}
      </dl>
    `

    const unorderedList = html`
      <ul>
        ${citations.map(([id, { short, full }]) => `
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
