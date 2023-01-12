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

  return function({ caption, credit, content='', mediaId, mediaType }) {
    const getEmbeddedMediaSrc = (({ mediaId, mediaType }) => {
      // @TODO implement utility for generating correct media embed URLs
      // for a given hosting service: youtube, soundcloud, vimeo
      return null;
    })
    const embeddedMediaSrc = getEmbeddedMediaSrc({ mediaId, mediaType })
    const embedLink = embeddedMediaSrc
      ? `<span class="q-figure__caption-embed-link"><a href="${embeddedMediaSrc}"><em>${embeddedMediaSrc}</em></a></span>`
      : ''
    return oneLine`
      <figcaption class="q-figure__caption">
        ${embedLink}
        ${markdownify(content)}
        <span class="q-figure__caption-content">${markdownify(caption || '')}</span>
        <span class="q-figure__credit">${markdownify(credit || '')}</span>
      </figcaption>
    `
  }
}
