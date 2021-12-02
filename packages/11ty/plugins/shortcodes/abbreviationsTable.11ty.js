const { html } = require('common-tags')

/**
 * Render an HTML <table> element
 *
 * @return     {boolean}  An HTML <table> element
 */
module.exports = function (context, params) {
  const { eleventyConfig, globalData: { config } } = context

  // return html`
  //   <table>
  //     <tbody>
  //       <tr id="${abbreviation}">
  //         <td>${markdownify(abbreviation)}</td>
  //         <td>${markdownify(citation)}</td>
  //       </tr>
  //     </tbody>
  //   </table>
  // `
  return 'ABBREVIATIONS TABLE'
}
