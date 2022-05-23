/**
 * Chicago Style Publication Contributors
 * 
 * @param  {Object} eleventyConfig
 * @param  {Object} params
 * @property  {Object} contributors - publication contributors
 * 
 * @example
 * "First Last."
 * "First Last and First Last."
 * "First Last, First Last, and First Last."
 * "First Last, First Last, and First Last, et al."
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

    stringParts.push(citationContributors(
      { 
        contributors: publicationAuthors, 
        max: 3
      }
    ))

    return stringParts.join('')
  }
}
