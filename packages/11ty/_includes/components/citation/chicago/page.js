const { html } = require('common-tags')

/**
 * @param  {Object} context
 */
module.exports = function(eleventyConfig, data) {
  const { publication, contributor } = data
  const citationContributors = eleventyConfig.getFilter('citationContributors')
  const citationChicagoPublicationContributors = eleventyConfig.getFilter('citationChicagoPublicationContributors')
  const citationChicagoPublishers = eleventyConfig.getFilter('citationChicagoPublishers')
  const citationPubDate = eleventyConfig.getFilter('citationPubDate')
  const pageTitlePartial = eleventyConfig.getFilter('pageTitle')
  const siteTitle = eleventyConfig.getFilter('siteTitle')

  const pageContributors = citationContributors(contributor, {
    max: 3,
    reverse: true,
    separator: ', '
  })

  let pageTitle = data.title
    ? pageTitlePartial(data)
    : data.label || 'Untitled.'

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
