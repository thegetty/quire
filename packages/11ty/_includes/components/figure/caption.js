const { oneLine } = require('~lib/common-tags')

/**
 * Figure caption and credit
 * @param      {Object} eleventyConfig  eleventy configuration
 *
 * @param      {Object} params
 * @property   {String} figure
 * @property   {String} content
 * @return     {String}  An HTML <figcaption> element
 */
module.exports = function(eleventyConfig) {
  const markdownify = eleventyConfig.getFilter('markdownify')
  const figureMediaEmbedUrl = eleventyConfig.getFilter('figureMediaEmbedUrl')
  return function({ caption, credit, content='', mediaId, mediaType}) {
    const { sourceUrl } = figureMediaEmbedUrl({ mediaId, mediaType })
    const mediaSourceLink = sourceUrl
      ? `<span class="q-figure__caption-embed-link"><a href="${sourceUrl}"><em>${sourceUrl}</em></a></span>`
      : ''
    return oneLine`
      <figcaption class="q-figure__caption">
        ${mediaSourceLink}
        ${markdownify(content)}
        <span class="q-figure__caption-content">${markdownify(caption || '')}</span>
        <span class="q-figure__credit">${markdownify(credit || '')}</span>
      </figcaption>
    `
  }
}
