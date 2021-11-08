/**
 * Renders <head> <meta> data tags
 *
 * @param      {Object}  data    data
 * @return     {String}  HTML meta and link elements
 */
module.exports = function(data) {
  const { publication } = data
  const { description, subjects } = publication

  const keywords = subjects.map(({ type, name }) => {
    if (type === 'keyword') return name
  })

  const link = [
    { rel: 'canonical', href: permalink },
    { rel: 'version-history', href: publication.repository_url }
  ]

  const contributors = publication.contributor.filter(({ type }) =>
    type === 'primary' || type === 'secondary'
  )

  contributors.forEach(({ type, url }) => {
    if (type === 'primary') {
      link.push({ rel: 'author', href: url })
    }
  })

  publication.publisher.forEach(({ url }) => {
    link.push({ rel: 'publisher', href: url })
  })

  const meta = [
    {
      name: 'description',
      content: page.abstract || description.one_line || description.full
    },
    {
      name: 'keywords',
      content: keywords.toString()
    }
  ]

  const linkTags = links.map(({ rel, href }) => (
    `<link rel="${rel}" href="${href}">`
  ))

  const metaTags = meta.map(({ name, content }) => (
    `<meta name="${name}" content="${content}">`
  ))

  return `
    ${linkTags.join('\n')}
    ${metaTags.join('\n')}
    ${dublin-core()}
    ${opengraph()}
    ${twitter-card()}
    ${json-ld()}
  `
}
