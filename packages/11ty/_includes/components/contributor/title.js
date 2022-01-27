module.exports = function(eleventyConfig, globalData, { affiliation, title }) {
  affiliation = affiliation
    ? `<span class="quire-contributor__affiliation">${ affiliation }</span>`
    : ''

  title = title
    ? `<span class="quire-contributor__title">${ title }</span>`
    : ''

  return [title, affiliation].join(', ')
}
