const { html } = require('~lib/common-tags')

module.exports = function(eleventyConfig) {
  return function(figures) {
    const zoomButtons = () => {
      const zoomInAriaLabel = 'Zoom In'
      const zoomOutAriaLabel = 'Zoom Out'
      // TODO determine how to programattically zoom with `image-service`/`canvas-panel`
      const displayZoomButtons = false
      return displayZoomButtons
        ? html`
          <button class="q-lightbox-ui__zoom-button q-lightbox-ui__zoom-button--in" title="${zoomInAriaLabel}" aria-label="${zoomInAriaLabel}">+</button>
          <button class="q-lightbox-ui__zoom-button q-lightbox-ui__zoom-button--out" title="${zoomOutAriaLabel}" aria-label="${zoomOutAriaLabel}">-</button>
        `
        : ''
    }

    const fullscreenButton = () => {
      const ariaLabel = 'View Fullscreen'
      return html`
        <button
          data-lightbox-fullscreen="false"
          class="q-lightbox-ui__fullscreen-button"
          title="${ariaLabel}" aria-label="${ariaLabel}"
          aria-label="View Fullscreen"
        ></button>
      `
    }

    // TODO implement download button for figure entries
    const downloadButton = () => {
      html``
    }

    const counter = () => {
      return figures.length > 1
        ? html`<span class="q-lightbox-ui__counter"><span data-lightbox-counter-current></span> of <span data-lightbox-counter-total></span></span>`
        : ''
    }

    const navigationButtons = () => {
      const previousAriaLabel = 'Previous (left arrow key)'
      const nextAriaLabel = 'Next (right arrow key)'
      return figures.length > 1
        ? html`
          <nav class="q-lightbox-ui__navigation">
            <button data-lightbox-previous class="q-lightbox-ui__navigation-button q-lightbox-ui__navigation-button--previous" title="${previousAriaLabel}" aria-label="${previousAriaLabel}"></button>
            <button data-lightbox-next class="q-lightbox-ui__navigation-button q-lightbox-ui__navigation-button--next" title="${nextAriaLabel}" aria-label="${nextAriaLabel}"></button>
          </nav>
        `
        : ''
    }

    return html`
      <div class="q-lightbox-ui" slot="ui">
        <div class="q-lightbox-ui__zoom-and-fullscreen">
          ${zoomButtons()}
          ${fullscreenButton()}
        </div>
        <div class="q-lightbox-ui__download-and-counter">
          ${downloadButton()}
          ${counter()}
        </div>
        ${navigationButtons()}
      </div>
    `
  }
}
