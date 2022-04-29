/**
 * MLA Publication Contributors
 * 
 * @param  {Object} eleventyConfig
 * @param  {Object} params
 * @property  {Object} contributors - publication contributors
 */
module.exports = function(eleventyConfig) {
  const citationContributors = eleventyConfig.getFilter('citationContributors')

  return function (params) {
    const { contributors } = params
    const publicationAuthors = contributors.filter(({ type }) => type === 'primary')
    const publicationAuthorCount = publicationAuthors.length
    const publicationEditors = contributors.filter(({ role }) => role === 'editor')
    const publicationEditorCount = publicationEditors.length

    let stringParts = []

    if (publicationEditorCount) stringParts.push('edited ')

    stringParts.push('by ')

    stringParts.push(citationContributors({ contributors: publicationAuthors, max: 2, separator: ' and '}))

    stringParts.push('.')

    return stringParts.join('')
  }
}
