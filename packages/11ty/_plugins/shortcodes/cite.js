const chalkFactory = require('~lib/chalk')
const { renderOneLine, stripIndent } = require('~lib/common-tags')

const logger = chalkFactory('shortcodes:cite')

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
  const icon = eleventyConfig.getFilter('icon')
  const markdownify = eleventyConfig.getFilter('markdownify')

  const {
    citations: { divider, popupStyle },
    localization: { defaultLocale }
  } = eleventyConfig.globalData.config

  const entries = eleventyConfig.globalData.references
    ? eleventyConfig.globalData.references.entries
    : []

  return function(id, pageNumber, text) {
    if (!id) {
      logger.warn(stripIndent`
        missing shortcode parameters ${page.inputPath}

          Usage:
            {% cite id pages text %}

            The 'id' parameter is required and should match an entry in the project 'references.yaml' data file.
            The 'pages' parameter is an optional page number or range of page numbers.
            The 'text' parameter is optional text for the link in place of the full or short form of the reference.

          Example:
            {% cite \"Faure 1909\" \"304\" \"1909\" %}
      `)
      return ''
    }


    const findCitationReference = (id) => {
      /**
       * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator/Collator#locales
       */
      const locales = defaultLocale

      /**
       * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator/Collator#options
       */
      const options = {
        ignorePunctuation: true,
        numeric: true,
        sensitivity: 'base',
        usage: 'search'
      }

      const entry = entries.find((entry) => {
        return entry.id.localeCompare(id, locales, options) === 0
      })

      return entry
        ? { ...entry, short: entry.short || entry.id }
        : logger.warn(stripIndent`
            references entry not found ${page.inputPath}
              cite id '${id}' does not match an entry in the project references data
          `)
    }

    const citation = findCitationReference(id)

    if (!citation) return

    // ensure that the page citations object exists
    if (!page.citations) page.citations = {}

    page.citations[id] = citation

    let buttonText = (text) ? text : citation.short

    if (pageNumber) buttonText += divider + pageNumber

    const button = popupStyle === 'icon'
      ? renderOneLine`
          ${buttonText}
          <button class="quire-citation__button quire-citation__button--icon" aria-expanded="false">
            ${icon({ type: 'add-circle', description: 'View reference' })}
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
        <span class="quire-citation__content" hidden>
          ${markdownify(citation.full)}
        </span>
      </cite>
    `
  }
}
