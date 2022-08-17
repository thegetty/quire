const { html } = require('~lib/common-tags')

module.exports = function(eleventyConfig) {
  const figureimageelement = eleventyConfig.getFilter('figureimageelement')

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
          ? html`<span class="q-lightbox__caption-label">${label}</span>`
          : '';
        const captionAndCreditSpan = caption || credit
          ? html`<span class="q-lightbox__caption-content">${caption ? caption : ''} ${credit ? credit : ''}</span>`
          : '';
        const captionElement = labelSpan.length || captionAndCreditSpan.length
          ? html`
            <div class="q-lightbox__caption">
              ${labelSpan}
              ${captionAndCreditSpan}
            </div>
          `
          : '';
        const elementId = `lightbox-image-${index}`;

        return html`
          <div
            class="q-lightbox__slide"
            data-lightbox-slide
            data-lightbox-id="${id}"
          >
            <div class="q-lightbox__image">
              ${figureimageelement(figure)}
            </div>
            ${captionElement}
          </div>
        `;
      })
      .join('')

    return html`
      <div slot="slides" class="q-lightbox__slides">
        ${slides}
      </div>
    `
  }
}
