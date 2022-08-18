const { html } = require('~lib/common-tags')

module.exports = function(eleventyConfig) {
  const figureImageElement = eleventyConfig.getFilter('figureImageElement')
  const markdownify = eleventyConfig.getFilter('markdownify')

  return function(figures) {
    if (!figures) return ''

    const slides = figures
      .reduce((slides, figure, index) => {
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
        const elementId = `lightbox-image-${index}`

        slides.push(html`
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
        `)

        return slides
      }, []).join('')

    return html`
      <div class="q-lightbox-slides">
        ${slides}
      </div>
    `
  }
}
