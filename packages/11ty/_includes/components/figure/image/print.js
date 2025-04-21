import escape from 'html-escape'
import { html } from '#lib/common-tags/index.js'
import path from 'node:path'

/**
 * Renders an image with a caption in print output
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  figure          Figure data
 *
 * @return     {String}  HTML containing an <img> element and a caption
 */
export default function (eleventyConfig) {
  const figureCaption = eleventyConfig.getFilter('figureCaption')
  const figureLabel = eleventyConfig.getFilter('figureLabel')

  const { imageDir } = eleventyConfig.globalData.config.figures

  return function (figure) {
    const { alt, caption, credit, id, label, src, staticInlineFigureImage } = figure

    if (!src && !staticInlineFigureImage) return ''

    const labelElement = figureLabel({ caption, id, label })
    const extOrIiifRegex = /^(https?:\/\/|\/iiif\/|\\iiif\\)/

    /**
     * NB: Image assets can be: external, in the asset dir, or in the IIIF directory
     **/
    let imageSrc
    switch (true) {
      case figure.isSequence:
        imageSrc = figure.staticInlineFigureImage
        break
      case figure.isCanvas || figure.isImageService:
        imageSrc = figure.printImage
        break
      case extOrIiifRegex.test(src):
        imageSrc = src
        break
      default:
        imageSrc = path.join(imageDir, src).replaceAll(path.sep, '/')
    }

    return html`
      <img alt="${escape(alt)}" class="q-figure__image" src="${imageSrc}"/>
      ${figureCaption({ caption, content: labelElement, credit })}
    `
  }
}
