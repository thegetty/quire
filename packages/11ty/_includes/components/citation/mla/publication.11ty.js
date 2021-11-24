
module.exports = function(eleventyConfig, { publication }) {
  const citationPubDate = eleventyConfig.getFilter('citationPubDate')()
  const citationPubSeries = eleventyConfig.getFilter('citationPubSeries')()
  const publishersCitation = eleventyConfig.getFilter('citationMLAPublishers')

  const publisherShortcode = publisherShortcodes[type]

  let publicationCitationParts = []

  if (citationPubSeries) publicationCitationParts.push(citationPubSeries)

  if (publication.publisher.length) {
    publicationCitationParts.push(publishersCitation())
  }

  if (citationPubDate) publicationCitationParts.push(', ', citationPubDate)

  publicationCitationParts.push('. ')

  if (publication.identifier.url) {
    publicationCitationParts.push(`<span class="url-string">${ publication.identifier.url }</span>.`)
  }

  return publicationCitationParts.join('')
}
