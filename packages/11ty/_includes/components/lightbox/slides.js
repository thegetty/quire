const { html } = require('~lib/common-tags')
const path = require('path')

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
  const renderFile = eleventyConfig.getFilter('renderFile')

  const assetsDir = path.join(eleventyConfig.dir.input, '_assets/images')

  return async function(figures) {
    if (!figures) return ''

    const slideElement = async (figure) => {
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

      const unsupportedMediaTypes = ['soundcloud', 'video', 'vimeo', 'youtube']
      if (unsupportedMediaTypes.includes(mediaType)) return '';

      const figureElement = async () => {
        return mediaType === 'table'
          ? await renderFile(path.join(assetsDir, src))
          : figureImageElement(figure)
      }

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
          data-lightbox-slide-id="${id}"
        >
          <div class="q-lightbox-slides__image">
            ${await figureElement()}
          </div>
          ${captionElement}
        </div>
      `
    }

    const slideElements = async () => {
      let slides = ''
      for (figure of figures) {
        slides += await slideElement(figure)
      }
      return slides
    }

    return html`
      <div class="q-lightbox-slides">
        ${await slideElements()}
      </div>
    `
  }
}
