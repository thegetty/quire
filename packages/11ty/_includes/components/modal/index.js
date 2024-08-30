const { html } = require('~lib/common-tags')

/**
 * Modal Tag
 *
 * @param      {Object}  eleventyConfig
 * @param      {Object}  globalData
 */
module.exports = function (eleventyConfig) {
  const lightboxSlide = eleventyConfig.getFilter('lightboxSlide')
  const lightboxUI = eleventyConfig.getFilter('lightboxUI')
  const lightboxData = eleventyConfig.getFilter('lightboxData')

  return async function (figures) {
    if (!figures) return

    // TODO: Do this Promise.all() dance outside the return value
    return html`
      <q-modal>
        <q-lightbox>
          ${await lightboxData(figures)}        
          ${(await Promise.all( figures.map( f => lightboxSlide(f)) )).join('')}
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
