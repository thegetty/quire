const { html } = require('common-tags')

/**
 * @param  {Object} eleventyConfig
 * @param  {Object} params
 * @property  {Object} publication
 * @property  {Object} page
 */
module.exports = function(eleventyConfig, params) {
  const { page, publication } = params
  const citationContributors = eleventyConfig.getFilter('citationContributors')
  const citationChicagoPublicationContributors = eleventyConfig.getFilter('citationChicagoPublicationContributors')
  const citationChicagoPublishers = eleventyConfig.getFilter('citationChicagoPublishers')
  const citationPubDate = eleventyConfig.getFilter('citationPubDate')
  const pageTitlePartial = eleventyConfig.getFilter('pageTitle')
  const siteTitle = eleventyConfig.getFilter('siteTitle')

  const pageContributors = citationContributors({ contributors: page.contributor }, {
    max: 3,
    reverse: true,
    separator: ', '
  })

  let pageTitle = data.title
    ? pageTitlePartial(data)
    : data.label || 'Untitled.'

  let publicationCitation = 
    [`In <em>${siteTitle()}</em>`, citationChicagoPublicationContributors({ contributors: publication.contributor })]
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
