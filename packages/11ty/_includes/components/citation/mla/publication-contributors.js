/**
 * @param  {Object} context
 */
module.exports = function({ eleventyConfig, globalData }) {
  const { publication } = globalData
  const citationContributors = eleventyConfig.getFilter('citationContributors')

  const publicationAuthors = publication.contributor.filter(({ type }) => type === 'primary')
  const publicationAuthorCount = publicationAuthors.length
  const publicationEditors = publication.contributor.filter(({ role }) => role === 'editor')
  const publicationEditorCount = publicationEditors.length

  let stringParts = []

  if (publicationEditorCount) stringParts.push('edited ')

  stringParts.push('by ')

  stringParts.push(citationContributors(publicationAuthors, { max: 2, separator: ' and '}))

  stringParts.push('.')

  return stringParts.join('')
}
