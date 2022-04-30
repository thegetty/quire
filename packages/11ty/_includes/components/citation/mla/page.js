const { html } = require('common-tags')
/**
 * @param  {Object} eleventyConfig
 * @param  {Object} params
 * @property  {Object} page
 * @property  {Object} publication
 */
module.exports = function(eleventyConfig) {
  const citationContributors = eleventyConfig.getFilter('citationContributors')
  const citationMLAPublicationContributors = eleventyConfig.getFilter('citationMLAPublicationContributors')
  const citationMLAPublishers = eleventyConfig.getFilter('citationMLAPublishers')
  const citationPubDate = eleventyConfig.getFilter('citationPubDate')
  const { config, publication } = eleventyConfig.globalData
  const pageTitle = eleventyConfig.getFilter('pageTitle')
  const siteTitle = eleventyConfig.getFilter('siteTitle')

  return function (params) {
    const { page } = params
    const { contributor, label, subtitle, title } = page.data
    const { identifier, pub_date: pubDate } = publication

    const pageContributors = citationContributors(
      {
        contributors: contributor,
        max: 2,
        reverse: true,
        separator: ', '
      }
    )
    const pageContributorsElement = pageContributors && `${pageContributors}.`

    let pageTitleElement
    if (title) {
      pageTitleElement = `“${pageTitle({ subtitle, title })}.”`
    } else if (label) {
      pageTitleElement = `“${label}.”`
    } else {
      pageTitleElement = 'Untitled.'
    }

    let publicationCitation =
      [` <em>${siteTitle()}</em>`, citationMLAPublicationContributors({ contributors: publication.contributor })]
        .filter(item => item)
        .join(', ')

    const publishers = citationMLAPublishers({ publication })
    publicationCitation = [publicationCitation, publishers].join(' ')

    const dateCitation = citationPubDate({ date: pubDate })

    if (dateCitation) publicationCitation = [publicationCitation, `${dateCitation}.`].join(', ')

    const url = page.url || identifier.url
    const urlElement = url && `<span class="url-string">${url}</span>.`

    const accessedDate = `Accessed <span class="cite-current-date">DD Mon. YYYY</span>.`

    return html` ${[
      pageContributorsElement,
      pageTitleElement,
      publicationCitation,
      urlElement,
      accessedDate,
    ]
      .filter((item) => item)
      .join(' ')}`
  }
}
