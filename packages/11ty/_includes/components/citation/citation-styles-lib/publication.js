/**
 * Adapts Quire publication data to the CSL-JSON 'book' type
 * https://docs.citationstyles.org/en/stable/specification.html
 * 
 * @return {Object}                CSL-JSON book
 */
module.exports = function (eleventyConfig) {
  const citationName = eleventyConfig.getFilter('citationName')
  const pubYear = eleventyConfig.getFilter('pubYear')
  const siteTitle = eleventyConfig.getFilter('siteTitle')

  const {
    contributor: publicationContributors,
    publisher: publishers,
  } = eleventyConfig.globalData.publication

  const { baseURL } = eleventyConfig.globalData.config

  return function (params) {
    let { context } = params

    return {
      id: context,
      author: publicationContributors
        .filter(({ type }) => type === 'primary')
        .map(citationName),
      editor: publicationContributors
        .filter(({ role }) => role === 'editor')
        .map(citationName),
      issued: {
        'date-parts': [[pubYear()]],
      },
      publisher: publishers[0].name,
      'publisher-place': publishers[0].location,
      title: `<em>${siteTitle()}</em>`,
      type: 'book',
      URL: baseURL
    }
  }
}
