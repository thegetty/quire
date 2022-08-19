const { html } = require('~lib/common-tags')
const path = require('path')

/**
 * Renders an img element for print output
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  figure          Figure data
 * @return     {String}  An <img> element
 */
module.exports = function(eleventyConfig) {
  const figurecaption = eleventyConfig.getFilter('figurecaption')
  const figurelabel = eleventyConfig.getFilter('figurelabel')

  const { imageDir } = eleventyConfig.globalData.config.params

  return function(figure) {
    const { alt, caption, credit, id, label, src='' } = figure

    const labelElement = figurelabel({ caption, id, label })

    let imageSrc

    switch (true) {
      case figure.isCanvas || figure.isImageService:
        imageSrc = figure.printImage
        break
      default:
        imageSrc = src.startsWith('http')
          ? src
          : path.join(imageDir, src)
        break
    }

    return html`
      <img alt="${alt}" class="q-figure__image" src="${imageSrc}"/>
      ${figurecaption({ caption, content: labelElement, credit })}
    `
  }
}
