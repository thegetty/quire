const { html } = require('~lib/common-tags')

module.exports = function(eleventyConfig) {
  const figureimageelement = eleventyConfig.getFilter('figureimageelement')
  const markdownify = eleventyConfig.getFilter('markdownify')

  return function(figures) {
    if (!figures) return ''

    const slides = figures
      .map((figure, index) => {
        const {
          caption,
          credit,
          id,
          iiif,
          label,
          preset,
          src
        } = figure;

        const labelSpan = label
          ? html`<span class="q-lightbox-slides__caption-label">${label}</span>`
          : '';
        const captionAndCreditSpan = caption || credit
          ? html`<span class="q-lightbox-slides__caption-content">${caption ? markdownify(caption) : ''} ${credit ? credit : ''}</span>`
          : '';
        const captionElement = labelSpan.length || captionAndCreditSpan.length
          ? html`
            <div class="q-lightbox-slides__caption">
              ${labelSpan}
              ${captionAndCreditSpan}
            </div>
          `
          : '';
        const elementId = `lightbox-image-${index}`;

        return html`
          <div
            class="q-lightbox-slides__slide"
            data-lightbox-slide
            data-lightbox-id="${id}"
          >
            <div class="q-lightbox-slides__image">
              ${figureimageelement(figure)}
            </div>
            ${captionElement}
          </div>
        `;
      })
      .join('')

    return html`
      <div slot="slides" class="q-lightbox-slides__slides">
        ${slides}
      </div>
    `
  }
}
