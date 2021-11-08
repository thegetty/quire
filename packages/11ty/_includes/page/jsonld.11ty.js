const path = require('path')

/**
 * Renders a JSON-LD representation of the page
 *
 * @param      {Object}  data    data
 * @return     {String}  An HTML script element with JSON-LD
 */
module.exports = function(data) {
  const { config, contributor, publication } = data
  const pageContributors = contributor ? contributor
    .map((contributor, { id }) => {
      contributor = id ? publication.contributor[id] : contributor
      if (!contributor) return
      const { full_name, first_name, last_name } = contributor
      return {
        type: 'Person',
        name: full_name || `${first_name} ${last_name}`
      }
    }) : []

  const publicationContributors = publication.contributor
    .filter((contributor) => contributor.type === 'primary')
    .map((contributor) => {
      const { full_name, first_name, last_name } = contributor
      return {
        type: 'Person',
        name: full_name || `${first_name} ${last_name}`,
        jobTitle: contributor.title,
        affiliation: contributor.affiliation,
        identifier: contributor.url
      }
    })

  const isbn = publication.identifier.isbn
  const publicationDescription = publication.description.full

  const Book = {
    type: 'Book',
    name: config.title,
    description: publicationDescription.replace(/\n/g,' '),
    isbn: isbn && isbn.replace(/-/g, '')
  }

  const Periodical = {
    type: 'PublicationIssue',
    name:  config.title,
    description: publicationDescription.replace(/\n/g,' '),
    issueNumber: publication.series_issue_number,
    isPartOf: {
      type: 'Periodical',
      name: publication.title,
      issn: publication.identifier.issn
    }
  }

  // publication.pub_type === null
  const WebSite = {
    type: 'WebSite',
    name: config.title,
  }

  const partOf = (type) => {
    switch (true) {
      case type === 'book':
        return Book
      case type === 'journal-periodical':
        return Periodical
      default:
        return WebSite
    }
  }

  const about = publication.subject
    .filter(({ type }) => type === 'getty')
    .map(({ identifier, name }) => {
      const vocab = {
        '/aat/': 'Thing',
        '/tgn/': 'Place',
        '/ulan/': 'Person'
      }
      return {
        type: vocab[identifier] || 'Thing',
        name,
        identifier
      }
    })

  const publisher = {
    type: 'Organization',
    name: publication.publisher.name,
    location: {
      type: 'PostalAddress',
      addressLocality: publication.publisher.location
    },
    identifier: publication.publisher.url
  }

  const Article = {
    '@type': 'Article',
    author: [...pageContributors],
    description: data.abstract && data.abstract.replace(/\n/g,' '),
    headline: data.title,
    image: config.baseURL && path.join(config.baseURL, imageDir, figureSubDir, data.cover),
    partOf: {
      ...partOf(publication.pub_type),
      about,
      author: [...publicationContributors],
      datePublished: publication.pub_date,
      dateModified: publication.revision_history.date,
      image: config.baseURL && path.join(config.BaseURL, imageDir, publication.promo_image),
      license: publication.license.url,
      keywords: publication.subject
        .filter(({ type }) => type === 'keyword')
        .map((name) => name)
        .toString(),
      publisher: [publisher],
      url: config.baseURL
    },
    url: data.canonicalURL
  }

  return JSON.stringify(
    {
      '@context': 'http://schema.org/',
      ...Article
    }
  )
}
