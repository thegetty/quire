module.exports = function(eleventyConfig, globalData, { affiliation, title }) {
  const affiliationElement = affiliation ? `<span class="quire-contributor__affiliation">${ affiliation }</span>` : ''
  const titleElement = title ? `<span class="quire-contributor__title">${ title }</span>` : ''
  return [title, affiliation].join(', ')
}