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
  const hasCanvasPanelProps = eleventyConfig.getFilter('hasCanvasPanelProps')
  const isImageService = eleventyConfig.getFilter('isImageService')

  const { imageDir } = eleventyConfig.globalData.config.params

  // strip the leading slash from imageDir
  const relativeImageDir = imageDir
    ? imageDir.match(/[^\/].*/)[0]
    : ''

  return function(figure) {
    const { alt, caption, credit, id, iiif, label, src } = figure

    const labelElement = figurelabel({ caption, id, label })

    let imageSrc

    switch (true) {
      case hasCanvasPanelProps(figure) || isImageService(figure):
        imageSrc = figure.printImage
        break
      default:
        imageSrc = src.startsWith('http') ? src : path.join(relativeImageDir, src)
        imageElement = `<img alt="${alt}" class="q-figure__image" src="${imageSrc}" />`
        break
    }

    return html`
      <img src="${imageSrc}"/>
      ${figurecaption({ caption, content: labelElement, credit })}
    `
  }
}
