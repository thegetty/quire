module.exports = function(eleventyConfig, { publication }, page) {
  const citationContributors = eleventyConfig.getFilter('citationContributors')
  const citationMLAPublicationContributors = eleventyConfig.getFilter('citationMLAPublicationContributors')
  const citationMLAPublishers = eleventyConfig.getFilter('citationMLAPublishers')
  const citationPubDate = eleventyConfig.getFilter('citationPubDate')
  const pageTitlePartial = eleventyConfig.getFilter('pageTitle')
  const siteTitle = eleventyConfig.getFilter('siteTitle')

  const citationParts = []

  const pageContributors = citationContributors(page.contributor, {
    max: 2,
    reverse: true,
    separator: ', '
  })

  if (pageContributors) citationParts.push(`${pageContributors}. `)

  let pageTitle = page.data.title 
    ? `"${pageTitlePartial(page)}."`
    : `"${page.data.label}."` || 'Untitled.'

  citationParts.push(pageTitle)

  let publicationCitation = 
    [` <em>${siteTitle()}</em>`, citationMLAPublicationContributors()]
    .filter(item => item)
    .join(', ')

  publicationCitation += ` ${citationMLAPublishers()}`

  if (citationPubDate()) publicationCitation+=(`, ${citationPubDate()}.`)

  if (publication.identifier.url) {
    publicationCitation+=(`<span class="url-string">${publication.identifier.url || permalink}</span>.`)
  }

  publicationCitation+=(` Accessed <span class="cite-current-date">DD Mon. YYYY</span>.`)

  citationParts.push(publicationCitation)

  return citationParts.join('')
}