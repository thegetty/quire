/**
 * Adapts Quire publication data to the CSL-JSON 'book' type
 * https://docs.citationstyles.org/en/stable/specification.html
 * 
 * @return {Object}                CSL-JSON book
 */
module.exports = function (eleventyConfig) {
  const citeName = eleventyConfig.getFilter('citeName')
  const citePublicationSeries = eleventyConfig.getFilter('citePublicationSeries')
  const siteTitle = eleventyConfig.getFilter('siteTitle')

  const {
    contributor: publicationContributors,
    pub_date: pubDate,
    publisher: publishers,
    pub_type: pubType
  } = eleventyConfig.globalData.publication

  const { url } = eleventyConfig.globalData.publication

  return function (params) {
    let { context } = params

    return {
      id: context,
      author: publicationContributors
        .filter(({ type }) => type === 'primary')
        .map(citeName),
      'container-title': citePublicationSeries(),
      editor: publicationContributors
        .filter(({ role }) => role === 'editor')
        .map(citeName),
      issued: pubDate && {
        'date-parts': [[new Date(pubDate).getFullYear()]],
      },
      publisher: publishers[0].name,
      'publisher-place': publishers[0].location,
      title: `<em>${siteTitle()}</em>`,
      type: pubType === 'journal-periodical' ? 'article-journal' : 'book',
      URL: url
    }
  }
}
