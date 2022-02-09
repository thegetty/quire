const link = require('../../link.js')
/**
 * Contributor page links
 * @param  {Object} context
 * @param  {Object} contributor
 *
 * @return {String}                Links to the provided contributor's pages
 */
module.exports = function (eleventyConfig , data) {
  const { contributor } = data
  const link = eleventyConfig.getFilter('link')
  const pageTitle = eleventyConfig.getFilter('pageTitle')

  const { pages } = contributor
  if (!pages) return ''
  return pages.map(({ data, url }) => {
    return `${link({
      classes: ['quire-contributor__page-link'],
      name: pageTitle(data, { withLabel: true }),
      url,
    })}`
  })
}
