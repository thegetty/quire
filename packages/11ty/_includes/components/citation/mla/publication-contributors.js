/**
 * MLA Publication Contributors
 * 
 * @param  {Object} eleventyConfig
 * @param  {Object} params
 * @property  {Object} contributors - publication contributors
 */
module.exports = function(eleventyConfig, params) {
  const { contributors } = params
  const citationContributors = eleventyConfig.getFilter('citationContributors')

  const publicationAuthors = contributors.filter(({ type }) => type === 'primary')
  const publicationAuthorCount = publicationAuthors.length
  const publicationEditors = contributors.filter(({ role }) => role === 'editor')
  const publicationEditorCount = publicationEditors.length

  let stringParts = []

  if (publicationEditorCount) stringParts.push('edited ')

  stringParts.push('by ')

  stringParts.push(citationContributors(publicationAuthors, { max: 2, separator: ' and '}))

  stringParts.push('.')

  return stringParts.join('')
}
