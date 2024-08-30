const { html } = require('~lib/common-tags')

/**
 * Modal Tag
 *
 * @param      {Object}  eleventyConfig
 * @param      {Object}  globalData
 */
module.exports = function (eleventyConfig) {
  const lightboxSlides = eleventyConfig.getFilter('lightboxSlides')
  const lightboxUI = eleventyConfig.getFilter('lightboxUI')
  const lightboxData = eleventyConfig.getFilter('lightboxData')

  return async function (figures) {
    if (!figures) return

    return html`
      <q-modal>
        <q-lightbox>
          ${await lightboxData(figures)}        
          ${await lightboxSlides(figures)}
          ${lightboxUI(figures)}
        </q-lightbox>
        <button
          data-modal-close
          class="q-modal__close-button"
          id="close-modal"
        ></button>
      </q-modal>
    `
  }
}
