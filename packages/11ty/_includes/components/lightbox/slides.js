const { html } = require('~lib/common-tags')

/**
 * Renders image slides with captions for display in a <q-lightbox> element
 *
 * @param      {Object} eleventyConfig  eleventy configuration
 *
 * @param      {Array} figures
 * @return     {String}  An HTML <img> element
 */
module.exports = function(eleventyConfig) {
  const figureImageElement = eleventyConfig.getFilter('figureImageElement')
  const markdownify = eleventyConfig.getFilter('markdownify')

  return function(figures) {
    if (!figures) return ''

    const slideElement = (fgure) => {
      const {
        caption,
        credit,
        id,
        iiif,
        label,
        media_type: mediaType,
        preset,
        src
      } = figure

      if (mediaType === 'video' || mediaType === 'audio') return slides;

      const labelSpan = label
        ? html`<span class="q-lightbox-slides__caption-label">${label}</span>`
        : ''
      const captionAndCreditSpan = caption || credit
        ? html`<span class="q-lightbox-slides__caption-content">${caption ? markdownify(caption) : ''} ${credit ? credit : ''}</span>`
        : ''
      const captionElement = labelSpan.length || captionAndCreditSpan.length
        ? html`
          <div class="q-lightbox-slides__caption">
            ${labelSpan}
            ${captionAndCreditSpan}
          </div>
        `
        : ''

      return html`
        <div
          class="q-lightbox-slides__slide"
          data-lightbox-slide
          data-lightbox-id="${id}"
        >
          <div class="q-lightbox-slides__image">
            ${figureImageElement(figure)}
          </div>
          ${captionElement}
        </div>
      `
    }

    let slides = ''
    for (figure of figures) {
      slides += slideElement(figure)
    }

    return html`
      <div class="q-lightbox-slides">
        ${slides}
      </div>
    `
  }
}
