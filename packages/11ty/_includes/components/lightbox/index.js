import { html } from '#lib/common-tags/index.js'

/**
 * Lightbox Tag
 * @todo add conditional rendering for epub and pdf when lightbox is included in `entry`
 *
 * @param      {Object}  eleventyConfig
 * @param      {Object}  globalData
 */
export default function (eleventyConfig, { page }) {
  const lightboxData = eleventyConfig.getFilter('lightboxData')
  const lightboxUI = eleventyConfig.getFilter('lightboxUI')

  return async function (figures = page.figures) {
    if (!figures) return

    return html`
      <q-lightbox>
        ${await lightboxData(figures)}
        ${lightboxUI(figures)}
      </q-lightbox>
    `
  }
}
