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
    const {
      alt,
      caption,
      credit,
      derivatives,
      id,
      isExternalResource,
      label,
      src,
      staticInlineFigureImage
    } = figure

    const { printImage } = derivatives

    if (printImage === undefined) return ''

    const { paths, dimensions } = printImage
    const { height, width } = dimensions

    if (!paths.internal) return ''

    const labelElement = figureLabel({ caption, id, label })

    return html`
      <img alt="${escape(alt)}"
           class="q-figure__image"
           height="${height}"
           src="${paths.internal}"
           width="${width}"/>
      ${figureCaption({ caption, content: labelElement, credit })}
    `
  }
}
