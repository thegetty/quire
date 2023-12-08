const { html } = require('~lib/common-tags')
const chalkFactory = require('~lib/chalk')
const path = require('path')

/**
 * Renders an iframe element with the SoundCloud audio player
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  figure          The figure
 *
 * @return     {String}  An embedded SoundCloud player and a caption
 */
module.exports = function(eleventyConfig) {
  const { imageDir } = eleventyConfig.globalData.config.figures

  return function({ poster='' }) {
    const posterSrc = poster.startsWith('http')
      ? poster
      : path.join(imageDir, poster)

    const imageElement = poster
      ? `<div class="q-figure__media-wrapper">
          <img src="${posterSrc}" />
        </div>`
      : ''

    return html`
      ${imageElement}
    `
  }
}
