/**
 * @param  {Object} eleventyConfig
 * @param  {Object} params
 * @property  {String} affiliation
 * @property  {String} title
 * 
 * @return {String}                     Contributor title and affiliation
 */
module.exports = function(eleventyConfig) {
  return function (params) {
    const { affiliation, title } = params
    const affiliationElement = affiliation ? `<span class="quire-contributor__affiliation">${ affiliation }</span>` : ''
    const titleElement = title ? `<span class="quire-contributor__title">${ title }</span>` : ''
    return [titleElement, affiliationElement].join(', ')
  }
}
