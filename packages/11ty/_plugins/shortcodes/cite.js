const chalkFactory = require('~lib/chalk')
const { renderOneLine, stripIndent } = require('~lib/common-tags')

const { warn } = chalkFactory('shortcodes:cite')

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

  const { entries } = eleventyConfig.globalData.references

  return function(id, pageNumber, text) {
    if (!id) {
      warn(stripIndent`
        missing shortcode parameters

          {% cite id pages text %}

          The 'id' parameter is required and should match an entry in the project 'references.yaml' data file.
          The 'pages' parameter is an optional page number or range of page numbers.
          The 'text' parameter is optional text for the link in place of the full or short form of the reference.

          @example {% cite \"Faure 1909\" \"304\" \"1909\" %}
      `)
      return ''
    }


    const findCitationReference = (id) => {
      const entry = entries.find((entry) => entry.id === id)
      return entry
        ? { ...entry, short: entry.short || id }
        : warn(`the cite id '${id}' does not match an entry in the project references data`)
    }

    const citation = findCitationReference(id)

    // ensure that the page citations object exists
    if (!page.citations) page.citations = {}

    page.citations[id] = citation

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
