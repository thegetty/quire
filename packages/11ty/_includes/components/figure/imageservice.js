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

  return function({ alt, height, id, preset, region, src, virtualSizes, width}) {
    const imageService = ((src).startsWith('http'))
      ? src
      : path.join('/', output, path.parse(src).name, imageServiceDirectory)

    return html`
      <image-service 
        alt="${alt}"
        class="q-figure__image"
        height="${height}"
        id="${id}"
        preset="${preset}"
        region="${region}"
        src="${imageService}"
        virtual-sizes="${virtualSizes}"
        width="${width}">
      </image-service>`
  }
}
