const path = require('path')

/**
 * Renders <head> meta data tags
 *
 * @param      {Object}  data    data
 * @return     {String}  HTML meta and link elements
 */
module.exports = class MetaData {
  data() {
    const link: [
      { rel: 'schema.dcterms', href: 'https://purl.org/dc/terms/' }
    ]

    const meta = [
      {
        name: 'dcterms.title',
        content: site.params.title },
      {
        name: 'dcterms.date',
        content: publication.pub_date
      },
      {
        name: 'dcterms.description',
        content: publication.description.one_line || publication.description.full
      },
      {
        name: 'dcterms.identifier',
        content: publication.identifier.isbn.replace(/-/g, '')
      },
      {
        name: 'dcterms.language',
        content: publication.language
      },
      {
        name: 'dcterms.rights',
        content: publication.copyright
      }
    ]

    publication.contributor.forEach((contributor) => {
      const { type, full_name, first_name, last_name } = contributor
      const name = full_name || `${first_name} ${last_name}`
      switch (type) {
        case 'primary':
          meta.push({ name: 'dcterms.creator' content: name })
          break
        case 'secondary':
          meta.push({ name: 'dcterms.contributor', content: name })
          break
        default:
          break
      }
    })

    publication.publisher.forEach(({ name, location }) => {
      meta.push({
        name: 'dcterms.publisher',
        content: `${name}, ${location}`
      })
    })

    publication.subject.forEach(({ name }) => {
      meta.push({
        name: 'dcterms.subject',
        content: name
      })
    })
  }

  render({ link, meta }) {
    const linkTags = links.map(({ rel, href }) => (
      `<link rel="${rel}" href="${href}">`
    ))

    const metaTags = meta.map(({ name, content }) => (
      `<meta name="${name}" content="${content}">`
    ))

    return `
      ${linkTags.join('\n')}
      ${metaTags.join('\n')}
    `
  }
}
