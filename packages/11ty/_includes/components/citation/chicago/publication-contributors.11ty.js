module.exports = function(eleventyConfig, { publication }) {
  const citationContributors = eleventyConfig.getFilter('citationContributors')

  const publicationAuthors = publication.contributor.filter(({ type }) => type === 'primary')
  const publicationAuthorCount = publicationAuthors.length
  const publicationEditors = publication.contributor.filter(({ role }) => role === 'editor')
  const publicationEditorCount = publicationEditors.length

  let stringParts = []

  if (publicationEditorCount) stringParts.push('edited ')

  stringParts.push('by ')

  stringParts.push(citationContributors(publicationAuthors, { max: 3, separator: ', ' }))

  stringParts.push('.')

  return stringParts.join('')
}
