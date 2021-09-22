const path = require('path')

/**
 * Renders a JSON-LD representation of the page
 *
 * @param      {Object}  data    data
 * @return     {String}  An HTML script element with JSON-LD
 */
module.exports = class JsonLd {
  data() {
    const Article = {
      '@type': 'Article',
      author: [...pageContributors],
      description: this.page.abstract.replace(/\n/g,' '),
      headline: this.page.title,
      image: path.join(site.BaseURL, imageDir, figureSubDir, this.page.cover),
      partOf: {
        ...partOf(publication.pub_type),
        about,
        author: [...publicationContributors]
        datePublished: publication.pub_date,
        dateModified: publication.revision_history.date,
        image: path.join(site.BaseURL, imageDir, publication.promo_image),
        license: publication.license.url,
        keywords: publication.subject
          .filter(({ type }) => type === 'keyword')
          .map((name) => name)
          .join(','),
        publisher: [publisher],
        url: site.baseURL,
      },
      url: this.page.permalink
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

    const Book = {
      type: 'Book',
      name: site.title,
      description: publication.description.full.replace(/\n/g,' '),
      isbn: publication.identifier.isbn.replace(/-/g, '')
    }

    const Periodical = {
      type: 'PublicationIssue',
      name:  site.title,
      description: publication.description.full.replace(/\n/g,' '),
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
      name: site.title,
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

    const pageContributors = this.page.contributor
      .map((contributor, { id }) => {
        contributor = id ? publication.contributor[id] : contributor
        const { full_name, first_name, last_name } = contributor
        return {
          type: 'Person',
          name: full_name || `${first_name} ${last_name}`
        }
      })

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

    const publisher = {
      type: 'Organization',
      name: publisher.name,
      location: {
        type: 'PostalAddress',
        addressLocality: publisher.location
      },
      identifier: publisher.url
    }

    return {
      '@context': 'http://schema.org/',
      ...Article
    }
  }

  render(data) {
    const jsonld = JSON.stringify(data)
    return `<script type="application/ld+json">${jsonld}</script>`
  }
}
