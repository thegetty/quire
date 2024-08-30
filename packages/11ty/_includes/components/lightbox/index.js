const { html } = require('~lib/common-tags')

/**
 * Lightbox Tag
 * @todo add conditional rendering for epub and pdf when lightbox is included in `entry`
 *
 * @param      {Object}  eleventyConfig
 * @param      {Object}  globalData
 */
module.exports = function (eleventyConfig, { page }) {
  const lightboxSlide = eleventyConfig.getFilter('lightboxSlide')
  const lightboxUI = eleventyConfig.getFilter('lightboxUI')
  const lightboxData = eleventyConfig.getFilter('lightboxData')

  return async function (figures=page.figures) {
    if (!figures) return

    const slides = await Promise.all( figures.map( f => lightboxSlide(f) ) )
    return html`
      <q-lightbox>
        ${await lightboxData(figures)}
        ${slides.join('')}
        ${lightboxUI(figures)}
      </q-lightbox>
    `
  }
}
