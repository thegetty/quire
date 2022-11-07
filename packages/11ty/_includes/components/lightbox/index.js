const { html } = require('~lib/common-tags')

/**
 * Lightbox Tag
 * @todo add conditional rendering for epub and pdf when lightbox is included in `entry`
 *
 * @param      {Object}  eleventyConfig
 * @param      {Object}  globalData
 */
module.exports = function (eleventyConfig, { page }) {
  const lightboxSlides = eleventyConfig.getFilter('lightboxSlides')
  const lightboxUI = eleventyConfig.getFilter('lightboxUI')

  return async function (figures=page.figures) {
    if (!figures) return

    return html`
      <q-lightbox>
        ${await lightboxSlides(figures)}
        ${lightboxUI(figures)}
      </q-lightbox>
    `
  }
}
