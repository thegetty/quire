const { html } = require('~lib/common-tags')
const path = require('path')

/**
 * Image Tag for figures that are static images
 * @param      {Object} eleventyConfig  eleventy configuration
 *
 * @param      {Object} params `figure` data from `figures.yaml`
 * @property   {String} alt The alt text for the image
 * @property   {String} src The src path for the image
 * @return     {String}  An <img> element
 */
module.exports = function(eleventyConfig) {
  const { imageDir } = eleventyConfig.globalData.config.figures

  return function ({ alt='', src='', isStatic=false }) {
    const imageSrc = src.startsWith('http') || isStatic ? src : path.join(imageDir, src)

    return html`
      <img alt="${alt}" class="q-figure__image" src="${imageSrc}" />
    `
  }
}
