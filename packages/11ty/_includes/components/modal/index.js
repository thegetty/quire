import { html } from '#lib/common-tags/index.js'

/**
 * Modal Tag
 *
 * @param      {Object}  eleventyConfig
 * @param      {Object}  globalData
 */
export default function (eleventyConfig) {
  const lightboxStyles = eleventyConfig.getFilter('lightboxStyles')
  const lightboxUI = eleventyConfig.getFilter('lightboxUI')
  const lightboxData = eleventyConfig.getFilter('lightboxData')

  return async function (figures) {
    if (!figures) return

    return html`
      <q-modal>
        <q-lightbox>
          ${lightboxStyles()}
          ${await lightboxData(figures)}
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
