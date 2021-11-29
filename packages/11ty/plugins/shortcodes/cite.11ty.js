const { oneLine } = require('common-tags')

/**
 *  This shortcode adds a linked Author Date citation reference to the text,
 *  and a hover pop-up with the full citation text.
 *
 *  @param      {String} id   Id of an entry in the project `references.yml`
 *  @param      {String} pageNumber   Refernced page number(s)
 *  @param      {String} text   Custom text to display instead of the reference id.
 *
 *  @example
 *  {% q-cite "Faure 1909" "54" %}
 *
 *  renders the follwing text "1909, 54"
 *
 *  @example
 *  {% q-cite "Faure 1909" "54" "1909" %}
 *
 *  When using the third parameter, the second parameter is required,
 *
 *  @example
 *  {% q-cite "Faure 1909" "" "1909" %}
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

  let buttonText = (text) ? text : citation.short || id

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
