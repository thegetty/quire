/**
 * Head Tag
 * 
 * @param      {Object}  eleventyConfig
 */
module.exports = function(eleventyConfig) {
  const analytics = eleventyConfig.getFilter('analytics')
  const dublinCore = eleventyConfig.getFilter('dublinCore')
  const jsonld = eleventyConfig.getFilter('jsonld')
  const litElements = eleventyConfig.getFilter('litElements')
  const opengraph = eleventyConfig.getFilter('opengraph')
  const twitterCard = eleventyConfig.getFilter('twitterCard')

  const { config, publication } = eleventyConfig.globalData

  const { imageDir } = config.params

  /**
   * @param  {Object} params The Whole Dang Data Object, from base.11ty.js
   */
  return function (page) {
    const { abstract, canonicalURL, cover, layout, title } = page
    const pageTitle = title
      ? `${title} | ${publication.title}`
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

        <title>${pageTitle}</title>

        <meta name="description" content="${description}">
        <meta name="keywords" content="${keywords}">

        <link rel="canonical" href="${canonicalURL}">
        <link rel="version-history" href="${publication.repositoryUrl}">

        <script src="https://cdn.jsdelivr.net/npm/@digirati/canvas-panel-web-components@latest"></script>

        ${litElements()}

        ${publisherLinks}

        ${contributorLinks}

        ${dublinCore()}

        ${opengraph({ page })}

        ${twitterCard({ abstract, cover, layout })}

        <script type="application/ld+json">${jsonld({ canonicalURL, page })}</script>

        <link rel="icon" href="/_assets/images/icons/favicon.ico" />
        <link rel="stylesheet" href="/_assets/styles/custom.css" />
        <link rel="stylesheet" href="/_assets/styles/application.css" />

        <!-- {% render 'polyfills/template.html' %} -->

        ${analytics()}
      </head>
    `
  }
}
