const { html } = require('common-tags')

/**
 * @param  {Object} eleventyConfig
 * @param  {Object} params
 * @property  {Object} publication
 * @property  {Object} page
 */
module.exports = function(eleventyConfig, globalData) {
  const citationContributors = eleventyConfig.getFilter('citationContributors')
  const citationChicagoPublicationContributors = eleventyConfig.getFilter('citationChicagoPublicationContributors')
  const citationChicagoPublishers = eleventyConfig.getFilter('citationChicagoPublishers')
  const citationPubDate = eleventyConfig.getFilter('citationPubDate')
  const { config, publication } = globalData
  const pageTitle = eleventyConfig.getFilter('pageTitle')
  const siteTitle = eleventyConfig.getFilter('siteTitle')

  return function (params) {
    const { page } = params
    const { contributor, label, subtitle, title } = page.data
    const { pub_date: pubDate } = publication
    const pageContributors = citationContributors(
      {
        contributors: contributor
      },
      {
        max: 3,
        reverse: true,
        separator: ', '
      }
    )

    let pageTitleElement = title
      ? pageTitle({ subtitle, title })
      : label || 'Untitled.'

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
}
