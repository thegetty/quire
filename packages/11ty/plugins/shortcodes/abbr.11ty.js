const { oneLine } = require('common-tags')

/**
 * Render an HTML <span> element with Quire object data
 *
 * This custom shortcode is based on the q-cite shortcode,
 * but simply displays the text of abbreviated items on hover.
 *
 * The abbreviation given in the shortcode is matched to known abbreviations
 * listed in the `abbreviations.yaml` data file. However, the match is done
 * after removing all punctuation. In this way, a user can add punctuation into
 * the abbreviation when needed in contect of the text, and this will not
 * effect the match.
 *
 * @example with a trailing comma
 *  {% q-abbr "Gaunt, “Attic Volute Krater”" %},
 *
 * @example with the comma inside the double quotes
 * {% q-abbr "Gaunt, “Attic Volute Krater,”" %}
 *
 * @return     {boolean}  An HTML <span> element
 */
module.exports = function (context, params) {
  const { eleventyConfig, globalData: { config } } = context
  // const getAbbr = eleventyConfig.getFilter('getAbbr')

  // return citation
  //   ? oneLine`
  //     <span class="quire-citation expandable">
  //       <span class="quire-citation__button" role="button" tabindex="0" aria-expanded="false">
  //         <span class="visually-hidden">Abbreviation: </span>
  //         ${markdownify(abbr)}
  //       </span>
  //       <span hidden class="quire-citation__content">
  //         ${markdownify('citation')}
  //       </span>
  //     </span>
  //   `
  // : oneLine`
  //   <strong style="color: red;">MISSING ABBREVIATION: ${markdownify(abbr)}</strong>
  //   `
  return 'ABBR'
}
