/**
 * @param  {Object} context
 * @param  {Object} params
 * @property  {String} affiliation
 * @property  {String} title
 * 
 * @return {String}                     Contributor title and affiliation
 */
module.exports = function(eleventyConfig, data) {
  const { affiliation, title } = data
  affiliation = affiliation ? `<span class="quire-contributor__affiliation">${ affiliation }</span>` : ''
  title = title ? `<span class="quire-contributor__title">${ title }</span>` : ''
  return [title, affiliation].join(', ')
}
