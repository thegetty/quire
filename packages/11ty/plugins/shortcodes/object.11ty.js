const { oneLine } = require('common-tags')
const path = require('path')

/**
 * Render an HTML <span> element with Quire object data
 *
 * This shortcode is based on the q-cite shortcode
 * and creates a hover-over tooltip on an accession number.
 * The hover-over displays a small image of the object as well as
 * the catalogue number, and it links to the relevant catalogue entry.
 *
 * @example
 *  {% q-object "77.AO.85" %}
 *
 * It will ignore any accession numbers that match that of the object on the
 * current page (so 77.AO.85 on the page dedicated to 77.AO.85 won’t be a link
 * or display an image). It also ignores any accession numbers not matching one
 * in objects.yml, and instead just returns the plain number without link or
 * other markup.
 *
 * Lastly, this will add the relevant catalogue number after the accession
 * number, but only on the first use of that number on the page.
 * By default this is included in parentheses, however passing a comma to
 * the shortcode will have it be comma separated instead.
 *
 * @example
 *  {% q-object "77.AO.85" "," %}
 *
 * @return     {boolean}  An HTML <span> element
 */
module.exports = function (context, { id, comma }) {
  const { eleventyConfig, globalData: { config } } = context
  const getFigure = eleventyConfig.getFilter('getFigure')
  const getObject = eleventyConfig.getFilter('getObject')

  // const object = getObject(id)
  // const figureId = object.figure && object.figure[0]
  // const figure = getFigure(figureId) || {}
  // const src = figure.src || ''
  // const imageSrc = path.join('/_assets/img', src)

  //<span>(cat. no. ${id})</span>

  // return oneLine`
  //   <span class="quire-citation quire-object expandable">
  //     <span class="quire-citation__button" role="button" tabindex="0" aria-expanded="false">
  //       ${markdownify(accession)}
  //     </span>
  //     <span hidden class="quire-citation__content">
  //       <img alt="" src="${imageSrc}" /><br />
  //       <a href="${id}">Cat. no. ${markdownify(id)}</a>
  //     </span>
  //   </span>
  // `
  return 'OBJECT'
}
