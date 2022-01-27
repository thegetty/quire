const { html } = require('common-tags')

/**
 * @param  {Object} context
 */
module.exports = function({ eleventyConfig, globalData, page }) {
  const { publication } = globalData
  const citationContributors = eleventyConfig.getFilter('citationContributors')
  const citationChicagoPublicationContributors = eleventyConfig.getFilter('citationChicagoPublicationContributors')
  const citationChicagoPublishers = eleventyConfig.getFilter('citationChicagoPublishers')
  const citationPubDate = eleventyConfig.getFilter('citationPubDate')
  const pageTitlePartial = eleventyConfig.getFilter('pageTitle')
  const siteTitle = eleventyConfig.getFilter('siteTitle')

  const pageContributors = citationContributors(page.data.contributor, { 
    max: 3,
    reverse: true,
    separator: ', '
  })

  let pageTitle = page.data.title 
    ? pageTitlePartial(page)
    : page.data.label || 'Untitled.'

  let publicationCitation = 
    [`In <em>${siteTitle()}</em>`, citationChicagoPublicationContributors()]
    .filter(item => item)
    .join(', ')

  publicationCitation = [publicationCitation, citationChicagoPublishers()].join(' ')

  if (citationPubDate()) publicationCitation = [publicationCitation, `${citationPubDate()}.`].join(', ')

  if (publication.identifier.url) {
    publicationCitation = [
      publicationCitation,
      `<span class="url-string">${publication.identifier.url || permalink}</span>.`
    ].join(' ')
  }

  return html`${pageContributors} "${pageTitle}" ${publicationCitation}`
  
}
