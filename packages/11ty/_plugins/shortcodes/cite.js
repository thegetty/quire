const renderOneLine = require('../common-tags/renderOneLine')

/**
 *  @todo Remove reliance on `this.page` in context. 
 *  This was a workaround, and we should reassess how this component provides citations data to the in-page bibliograph.
 * 
 *  This shortcode adds a linked Author Date citation reference to the text,
 *  and a hover pop-up with the full citation text.
 *
 *  @param  {String} id   Id of an entry in the project `references.yml`
 *  @param  {String} pageNumber   Refernced page number(s)
 *  @param  {String} text   Custom inline citation text to render.
 *
 *  @example {% cite "Faure 1909" %}
 *  renders the citation "Faure 1909"
 *
 *  @example {% cite "Faure 1909" "54" %}
 *  renders the citation "Faure 1909, 54"
 *
 *  Using the citatation id as the text can be overridden using the third
 *  positional parameter,
 *  @example {% cite "Faure 1909" "54" "1909" %}
 *  renders the citation "1909"
 *
 *  Nota bene: parameters are positional, therefore the second parameter is required, even if blank, when using the third parameter,
 *  @example {% cite "Faure 1909" "" "1909" %}
 *  renders the citation "1909"
 */
module.exports = function(eleventyConfig, { page }) {
  const markdownify = eleventyConfig.getFilter('markdownify')

  const {
    citationPageLocationDivider: divider,
    citationPopupStyle: popupStyle
  } = eleventyConfig.globalData.config.params

  let references = eleventyConfig.globalData.references

  return function(id, pageNumber, text) {
    if (!id) {
      console.warn('1, 2 or 3 values must be supplied with this shortcode. The first is required and should match a reference in the project `references.yml` data file; the second is optional, and should be a page number or range of page numbers; the third is optional, and should be the text to appear in the link if not the full short form of the reference, example \"{% qcite \"Faure 1909\" \"304\" \"1909\" %}\"')
      return ''
    }

    references = Object.fromEntries(
      references.entries.map(({ id, full, short }) => [id, { full, short }])
    )

    const citation = references[id]

    if (!citation) {
      console.warn(`The id '${id}' does not match a reference in the project data file references.yaml`)
      return ''
    }

    if (!page.citations) page.citations = []
    page.citations.push(citation)

    let buttonText = (text) ? text : citation.short || id

    if (pageNumber) buttonText += divider + pageNumber

    const button = popupStyle === 'icon'
      ? renderOneLine`
          ${buttonText}
          <button class="quire-citation__button material-icons md-18 material-control-point" aria-expanded="false">
            control_point
          </button>
      `
      : renderOneLine`
          <span class="quire-citation__button" role="button" tabindex="0" aria-expanded="false">
            ${buttonText}
          </span>
      `

    return renderOneLine`
      <cite class="quire-citation expandable">
        ${button}
        <span hidden class="quire-citation__content">
          ${markdownify(citation.full)}
        </span>
      </cite>
    `
  }
}
