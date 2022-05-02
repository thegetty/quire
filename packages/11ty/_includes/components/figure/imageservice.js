const { html } = require('common-tags')
const path = require('path')

/**
 * Image Service Web Component
 * @param      {Object} eleventyConfig  eleventy configuration
 * 
 * @param      {Object} params
 * @property   {String} figure
 * @return     {String}  An <image-service> element
 */
module.exports = function(eleventyConfig) {
  const { imageServiceDirectory, output } = eleventyConfig.globalData.iiifConfig

  return function({ alt, id, preset, region, src, width}) {
    const imageService = ((src).startsWith('http'))
      ? src
      : path.join('/', output, path.parse(src).name, imageServiceDirectory)

    return html`
      <image-service 
        alt="${alt}"
        id="${id}"
        class="q-figure__image"
        src="${imageService}"
        preset="${preset}"
        region="${region}"
        width="${width}">
      </image-service>`
  }
}
