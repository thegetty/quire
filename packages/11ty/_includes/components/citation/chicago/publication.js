/**
 * @param  {Object} context
 */
module.exports = function({ eleventyConfig, globalData }) {
  const { publication } = globalData
  const citationPubDate = eleventyConfig.getFilter('citationPubDate')
  const citationPubSeries = eleventyConfig.getFilter('citationPubSeries')
  const publishersCitation = eleventyConfig.getFilter('citationChicagoPublishers')

  let publicationCitationParts = []

  if (citationPubSeries()) publicationCitationParts.push(citationPubSeries())

  if (publication.publisher.length) {
    publicationCitationParts.push(publishersCitation())
  }

  if (citationPubDate()) publicationCitationParts.push(', ', citationPubDate())

  publicationCitationParts.push('. ')

  if (publication.identifier.url) {
    publicationCitationParts.push(`<span class="url-string">${ publication.identifier.url }</span>.`)
  }

  return publicationCitationParts.join('')
}
