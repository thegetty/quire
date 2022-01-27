const analytics = require('./analytics.11ty.js')
const dublinCore = require('../page/dublin-core.11ty.js')
const opengraph = require('../page/opengraph.11ty.js')
const twitterCard = require('../page/twitter-card.11ty.js')
const jsonld = require('../page/jsonld.11ty.js')

module.exports = function(eleventyConfig, globalData, data) {
  const { config, publication } = globalData

  const title = data.title
    ? `${data.title} | ${publication.title}`
    : publication.title

  const description = publication.description.full || publication.description.one_line

  const publisherLinks = publication.publisher
    .filter(({ url }) => url)
    .map(({ url }) => `<link rel="publisher" href="${ url }">`)
    .join('\n')

  const contributorLinks = publication.contributor
    .filter(({ url }) => url)
    .map(({ url }) => `<link rel="author" href="${ url }">`)
    .join('\n')

  const keywords = publication.subject
    .filter(({ type }) => type === "keyword")
    .map(({ name }) => name)
    .join(', ')

  return `
    <head>
      <meta charset="utf-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <meta name="robots" content="noindex, nofollow"/>

      <title>${title}</title>

      <meta name="description" content="${description}">
      <meta name="keywords" content="${keywords}">

      <link rel="canonical" href="${data.canonicalURL}">
      <link rel="version-history" href="${publication.repositoryUrl}">

      ${publisherLinks}

      ${contributorLinks}

      ${dublinCore(data)}

      ${opengraph(data)}

      ${twitterCard(data)}

      <script type="application/ld+json">${jsonld(data)}</script>

      <link rel="icon" href="/_assets/img/icons/favicon.ico" />
      <link rel="stylesheet" href="/_assets/styles/custom.css" />
      <link rel="stylesheet" href="/_assets/styles/application.css" />

      <!-- {% render 'polyfills/template.html' %} -->

      ${analytics(data)}
    </head>
  `
}
