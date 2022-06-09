/**
 * Adapts Quire page data to the CSL-JSON 'webpage' type
 * https://docs.citationstyles.org/en/stable/specification.html
 *
 * @return {Object} CSL-JSON page
 */
module.exports = function (eleventyConfig) {
  const citationName = eleventyConfig.getFilter('citationName')
  const getContributor = eleventyConfig.getFilter('getContributor')
  const pageTitle = eleventyConfig.getFilter('pageTitle')
  const siteTitle = eleventyConfig.getFilter('siteTitle')

  const { baseURL } = eleventyConfig.globalData.config

  const {
    contributor: publicationContributors,
    pub_date: pubDate,
    publisher: publishers,
  } = eleventyConfig.globalData.publication

  return function (params) {
    let { context, page, type } = params
    const pageContributors = page.data.contributor.map((item) =>
      getContributor(item)
    )

    return {
      id: context,
      author: pageContributors
        .filter(({ type }) => type === 'primary')
        .map(citationName),
      'container-author': publicationContributors
        .filter(({ type }) => type === 'primary')
        .map(citationName),
      'container-title': `<em>${siteTitle()}</em>`,
      editor: pageContributors
        .filter(({ role }) => role === 'editor')
        .map(citationName),
      issued: pubDate && {
        'date-parts': [[new Date(pubDate).getFullYear()]],
      },
      publisher: publishers[0].name,
      'publisher-place': publishers[0].location,
      title: pageTitle(page.data),
      type: 'chapter',
      URL: new URL(page.url, baseURL)
    }
  }
}
