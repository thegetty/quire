/**
 * @param  {Object} eleventyConfig
 * @param  {Object} params
 * @property  {Object} page
 * @property  {Object} publication
 */
module.exports = function(eleventyConfig, params) {
  const { config, page, publication } = params
  const { pub_date: pubDate } = publication
  const citationContributors = eleventyConfig.getFilter('citationContributors')
  const citationMLAPublicationContributors = eleventyConfig.getFilter('citationMLAPublicationContributors')
  const citationMLAPublishers = eleventyConfig.getFilter('citationMLAPublishers')
  const citationPubDate = eleventyConfig.getFilter('citationPubDate')
  const pageTitle = eleventyConfig.getFilter('pageTitle')
  const siteTitle = eleventyConfig.getFilter('siteTitle')

  const citationParts = []

  const pageContributors = citationContributors(
    {
      contributors: page.contributor
    },
    {
      max: 2,
      reverse: true,
      separator: ', '
    }
  )

  if (pageContributors) citationParts.push(`${pageContributors}. `)

  let pageTitleElement 
  if (page.data.title) {
    pageTitleElement = `"${pageTitle({ page })}."`
  } else if (page.data.label) {
    pageTitleElement = `"${page.data.label}."`
  }

  citationParts.push(pageTitleElement || 'Untitled.')

  let publicationCitation = 
    [` <em>${siteTitle()}</em>`, citationMLAPublicationContributors({ contributors: publication.contributor })]
    .filter(item => item)
    .join(', ')

  publicationCitation += ` ${citationMLAPublishers({ publicatoin })}`

  if (citationPubDate(pubDate)) publicationCitation+=(`, ${citationPubDate(pubDate)}.`)

  if (publication.identifier.url) {
    publicationCitation+=(`<span class="url-string">${publication.identifier.url || permalink}</span>.`)
  }

  publicationCitation+=(` Accessed <span class="cite-current-date">DD Mon. YYYY</span>.`)

  citationParts.push(publicationCitation)

  return citationParts.join('')
}
