/**
 * @param  {Object} eleventyConfig
 * @param  {Object} params
 */
module.exports = function(eleventyConfig, globalData) {
  const citationPubDate = eleventyConfig.getFilter('citationPubDate')
  const citationPubSeries = eleventyConfig.getFilter('citationPubSeries')
  const citationPublishers = eleventyConfig.getFilter('citationChicagoPublishers')
  const { publication } = globalData

  return function (params) {
    const { identifier, pub_date: pubDate, publisher } = publication

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
