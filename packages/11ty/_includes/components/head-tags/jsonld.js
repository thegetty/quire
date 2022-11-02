const path = require('path')

/**
 * Renders a JSON-LD representation of the page
 *
 * @param      {Object}  eleventyConfig
 * @param      {Object}  data
 * 
 * @return     {String}  An HTML script element with JSON-LD
 */
module.exports = function(eleventyConfig) {
  const { config, publication } = eleventyConfig.globalData
  const { imageDir } = config.figures

  return function ({ canonicalURL, page }) {
    const { abstract, contributor, cover, title } = page
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
    const publicationDescription = publication.description.full || ''

    const Book = {
      type: 'Book',
      name: publication.title,
      description: publicationDescription.replace(/\n/g,' '),
      isbn: isbn && isbn.replace(/-/g, '')
    }

    const Periodical = {
      type: 'PublicationIssue',
      name:  publication.title,
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
      name: publication.title,
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
      description: abstract && abstract.replace(/\n/g,' '),
      headline: title,
      image: cover && path.join(imageDir, cover),
      partOf: {
        ...partOf(publication.pub_type),
        about,
        author: [...publicationContributors],
        datePublished: publication.pub_date,
        dateModified: publication.revision_history.date,
        image: publication.promo_image && path.join(imageDir, publication.promo_image),
        license: publication.license.url,
        keywords: publication.subject
          .filter(({ type }) => type === 'keyword')
          .map((name) => name)
          .toString(),
        publisher: [publisher],
        url: publication.url
      },
      url: canonicalURL
    }

    return JSON.stringify(
      {
        '@context': 'http://schema.org/',
        ...Article
      }
    )
  }
}
