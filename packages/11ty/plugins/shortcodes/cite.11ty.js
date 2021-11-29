const { oneLine } = require('common-tags')

/**
 *  This shortcode adds a linked Author Date citation reference to the text,
 *  and a hover pop-up with the full citation text.
 *
 *  @example
 *
 *  {% q-cite "Faure 1909" "54" %}
 *
 *  The first positional parameter is a short form citation that should match one
 *  in `references.yml`. The second, optional parameter is a page reference. The
 *  above sample would output as: Faure 1909, 54.
 *
 *  A third optional parameter allows you to customize the text that appears in the
 *  link if not the short form of the citation. The following sample would appear
 *  simply as: 1909, 54.
 *
 *  @example
 *  {% q-cite "Faure 1909" "54" "1909" %}
 *
 *  In using this third parameter, you still need to have the second parameter,
 *  even if it’s empty. The following sample would appear simply as: 1909.
 *
 *  @example
 *  {% q-cite "Faure 1909" "" "1909" %}
 *
 *  The text element between the author date reference and the page can be changed
 *  with the `citationPageLocationDivider` property in `config.yml`
 *
 */
module.exports = function(context, id, pageNumber, year) {
  const { eleventyConfig, globalData, globalData: { config }, page } = context
  let references = globalData.references
  const markdownify = eleventyConfig.getFilter('markdownify')

  if (!id) {
    console.warn('1, 2 or 3 values must be supplied with this shortcode. The first is required and should match a reference in the project `references.yml` data file; the second is optional, and should be a page number or range of page numbers; the third is optional, and should be the text to appear in the link if not the full short form of the reference, example \"{% qcite \"Faure 1909\" \"304\" \"1909\" %}\"')
    return ''
  }

  references = Object.fromEntries(
    references.entries.map(({ id, full, short }) => [id, { full, short }])
  )

  const citation = references[id]

  if (!page.citations) page.citations = []
  page.citations.push(citation)

  if (!citation) {
    console.warn('The id supplied does not match a reference in the project `references.yml` data file.')
    return ''
  }

  const {
    citationPageLocationDivider: divider,
    citationPopupStyle: popupStyle
   } = config.params

  let buttonText = (year)
    ? `<time datetime="${year}">${year}</time>`
    : citation.short || id

  if (pageNumber) buttonText += divider + pageNumber

  const button = popupStyle === 'icon'
    ? oneLine`
        ${buttonText}
        <button class="quire-citation__button material-icons md-18 material-control-point" aria-expanded="false">
          control_point
        </button>
      `
    : oneLine`
        <span class="quire-citation__button" role="button" tabindex="0" aria-expanded="false">
          ${buttonText}
        </span>
      `

  return oneLine`
    <cite class="quire-citation expandable">
      ${button}
      <span hidden class="quire-citation__content">${markdownify(citation.full)}</span>
    </cite>
  `
}
