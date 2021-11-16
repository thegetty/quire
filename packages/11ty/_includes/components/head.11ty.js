const analytics = require('./analytics.11ty.js')
const dublinCore = require('./page/dublin-core.11ty.js')
const opengraph = require('./page/opengraph.11ty.js')
const twitterCard = require('./page/twitter-card.11ty.js')
const jsonld = require('./page/jsonld.11ty.js')

module.exports = function(data) {

  const { canonicalURL, config, publication, title } = data

  const publisherLinks = publication.publisher
    .filter(({ url }) => url)
    .map(({ url }) => {
      return `<link rel="publisher" href="${ url }">`
    })

  const contributorLinks = publication.contributor
    .filter(({ url }) => url)
    .map(({ url }) => {
      return `<link rel="author" href="${ url }">`
    })

  const keywords = publication.subject
  .filter(({ type }) => type === "keyword")
  .map(({ name }) => name)

  return `
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>

      ${config.online ? '<meta name="robots" content="noindex, nofollow"/>' : ''}

      <title>${ [title, publication.title].join(' | ') }</title>

      <meta name="description" content="${ publication.description.full || publication.description.one_line }">
      <meta name="keywords" content="${ keywords.join(', ') }">

      <link rel="canonical" href="${ canonicalURL }">
      <link rel="version-history" href="${ publication.repositoryUrl }">

      ${publisherLinks.join('\n')}

      ${contributorLinks.join('\n')}

      ${dublinCore(data)}
      ${opengraph(data)}
      ${twitterCard(data)}
      <script type="application/ld+json">${jsonld(data)}</script>

      <link rel="icon" href="/_assets/img/icons/favicon.ico" />
      <link rel="stylesheet" href="/css/custom.css" />
      <link rel="stylesheet" href="/css/application.css" />

      <!-- {% render 'polyfills/template.html' %} -->

      ${analytics(data)}
    </head>
  `
}
