const { html } = require('~lib/common-tags')
const sass = require('sass')
const path = require('path')
/**
 * Lightbox Tag
 * @todo add conditional rendering for epub and pdf when lightbox is included in `entry`
 *
 * @param      {Object}  eleventyConfig
 * @param      {Object}  globalData
 */
module.exports = function (eleventyConfig) {
  const lightboxStylesPath = path.resolve('content/_assets/styles/components/q-lightbox.scss')

  // TODO: if not lightboxStylesPath WARN
  let lightboxCSS = sass.compile(lightboxStylesPath)

  return function () {
    if (!lightboxCSS) return

    return html`
      <style slot="lightbox-styles">
        ${lightboxCSS.css}
      </style>
    `
  }
}
