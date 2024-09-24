const { html } = require('~lib/common-tags')
 
/**
 * Lightbox Tag
 * @todo add conditional rendering for epub and pdf when lightbox is included in `entry`
 *
 * @param      {Object}  eleventyConfig
 * @param      {Object}  globalData
 */
module.exports = function (eleventyConfig, { page }) {
  const lightboxData = eleventyConfig.getFilter('lightboxData')
  const lightboxUI = eleventyConfig.getFilter('lightboxUI')

  return async function (figures=page.figures) {
    if (!figures) return

    return html`
      <q-lightbox>
        ${await lightboxData(figures)}
        ${lightboxUI(figures)}
      </q-lightbox>
    `
  }
}
