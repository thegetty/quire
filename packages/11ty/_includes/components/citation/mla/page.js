/**
 * @param  {Object} eleventyConfig
 * @param  {Object} params
 * @property  {Object} page
 * @property  {Object} publication
 */
module.exports = function(eleventyConfig, globalData) {
  const citationContributors = eleventyConfig.getFilter('citationContributors')
  const citationMLAPublicationContributors = eleventyConfig.getFilter('citationMLAPublicationContributors')
  const citationMLAPublishers = eleventyConfig.getFilter('citationMLAPublishers')
  const citationPubDate = eleventyConfig.getFilter('citationPubDate')
  const { config, publication } = globalData
  const pageTitle = eleventyConfig.getFilter('pageTitle')
  const siteTitle = eleventyConfig.getFilter('siteTitle')

  return function (params) {
    const { page } = params
    const { contributor, label, subtitle, title } = page
    const { pub_date: pubDate } = publication

    const citationParts = []

    const pageContributors = citationContributors(
      {
        contributors: contributor
      },
      {
        max: 2,
        reverse: true,
        separator: ', '
      }
    )

    let pageTitleElement
    if (title) {
      pageTitleElement = `"${pageTitle({ subtitle, title })}."`
    } else if (label) {
      pageTitleElement = `"${label}."`
    }

    citationParts.push(pageTitleElement || 'Untitled.')

    let publicationCitation =
      [` <em>${siteTitle()}</em>`, citationMLAPublicationContributors({ contributors: publication.contributor })]
        .filter(item => item)
        .join(', ')

    publicationCitation += ` ${citationMLAPublishers({ publication })}`

    if (citationPubDate(pubDate)) publicationCitation+=(`, ${citationPubDate(pubDate)}.`)

    if (publication.identifier.url) {
      publicationCitation+=(`<span class="url-string">${publication.identifier.url || permalink}</span>.`)
    }

    publicationCitation+=(` Accessed <span class="cite-current-date">DD Mon. YYYY</span>.`)

    citationParts.push(publicationCitation)

    return citationParts.join('')
  }
}
