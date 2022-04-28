/**
 * @param  {Object} context
 */
module.exports = function(eleventyConfig) {
  const citationPubDate = eleventyConfig.getFilter('citationPubDate')
  const citationPublishers = eleventyConfig.getFilter('citationMLAPublishers')
  const citationPubSeries = eleventyConfig.getFilter('citationPubSeries')
  const { publication } = eleventyConfig.globalData

  return function (params) {
    const { type } = params
    const { identifier, pub_date: pubDate, publisher } = publication

    const publisherShortcode = publisherShortcodes[type]

    let publicationCitationParts = []

    if (citationPubSeries({ publication })) publicationCitationParts.push(citationPubSeries({ publication }))

    if (publisher.length) {
      publicationCitationParts.push(citationPublishers({ publication }))
    }

    if (citationPubDate(pubDate)) {
      publicationCitationParts.push(', ', new Date(citationPubDate(pubDate)).getFullYear())
    }

    publicationCitationParts.push('. ')

    if (identifier.url) {
      publicationCitationParts.push(`<span class="url-string">${ identifier.url }</span>.`)
    }

    return publicationCitationParts.join('')
}
}
