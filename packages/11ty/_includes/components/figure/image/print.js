import escape from 'html-escape'
import { html } from '#lib/common-tags/index.js'

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

  return function (figure) {
    const {
      alt,
      caption,
      credit,
      derivatives,
      id,
      label
    } = figure

    const { printImage } = derivatives

    if (printImage === undefined) return ''

    const { paths, dimensions } = printImage
    const { height, width } = dimensions ?? {}

    if (!paths.internal) return ''

    const labelElement = figureLabel({ caption, id, label })
    const heightAttr = height ? `height="${height}"` : ''
    const widthAttr = width ? `width="${width}"` : ''

    return html`
      <img alt="${escape(alt)}"
           class="q-figure__image"
           ${heightAttr}
           ${widthAttr}
           src="${paths.internal}" />
      ${figureCaption({ caption, content: labelElement, credit })}
    `
  }
}
