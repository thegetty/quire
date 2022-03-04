/**
 * @param  {Object} context
 * @param  {Object} contributor
 * @property  {String} affiliation
 * @property  {String} title
 * 
 * @return {String}                     Contributor title and affiliation
 */
module.exports = function(eleventyConfig, globalData) {
  return function (params) {
    const { affiliation, title } = contributor
    affiliation = affiliation ? `<span class="quire-contributor__affiliation">${ affiliation }</span>` : ''
    title = title ? `<span class="quire-contributor__title">${ title }</span>` : ''
    return [title, affiliation].join(', ')
  }
}
