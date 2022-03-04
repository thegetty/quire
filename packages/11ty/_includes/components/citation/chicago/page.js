const { html } = require('common-tags')

/**
 * @param  {Object} eleventyConfig
 * @param  {Object} params
 * @property  {Object} publication
 * @property  {Object} page
 */
module.exports = function(eleventyConfig, params) {
  const { config, page, publication } = params
  const { pub_date: pubDate } = publication
  const citationContributors = eleventyConfig.getFilter('citationContributors')
  const citationChicagoPublicationContributors = eleventyConfig.getFilter('citationChicagoPublicationContributors')
  const citationChicagoPublishers = eleventyConfig.getFilter('citationChicagoPublishers')
  const citationPubDate = eleventyConfig.getFilter('citationPubDate')
  const pageTitle = eleventyConfig.getFilter('pageTitle')
  const siteTitle = eleventyConfig.getFilter('siteTitle')

  const pageContributors = citationContributors(
    { 
      contributors: page.contributor 
    }, 
    {
      max: 3,
      reverse: true,
      separator: ', '
    }
  )

  let pageTitleElement = data.title
    ? pageTitle({ page })
    : data.label || 'Untitled.'

  let publicationCitation = 
    [`In <em>${siteTitle()}</em>`, citationChicagoPublicationContributors({ contributors: publication.contributor })]
    .filter(item => item)
    .join(', ')

  publicationCitation = [publicationCitation, citationChicagoPublishers({ publication })].join(' ')

  if (citationPubDate(pubDate)) publicationCitation = [publicationCitation, `${citationPubDate(pubDate)}.`].join(', ')

  if (publication.identifier.url) {
    publicationCitation = [
      publicationCitation,
      `<span class="url-string">${publication.identifier.url || permalink}</span>.`
    ].join(' ')
  }

  return html`${pageContributors} "${pageTitleElement}" ${publicationCitation}`
  
}
