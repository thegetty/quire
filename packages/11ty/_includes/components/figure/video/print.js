import { html } from '#lib/common-tags/index.js'
import chalkFactory from '#lib/chalk/index.js'

const logger = chalkFactory('Figure Video')

/**
 * Renders an image fallback for a video player in print output
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  figure          The figure object
 *
 * @return     {String}  HTML containing a fallback image and a caption
 */
export default function (eleventyConfig) {
  const figureCaption = eleventyConfig.getFilter('figureCaption')
  const figureLabel = eleventyConfig.getFilter('figureLabel')

  return function ({
    aspect_ratio: aspectRatio,
    caption,
    credit,
    derivatives,
    id,
    label,
    mediaId,
    mediaType
  }) {
    const { printImage } = derivatives
    if (!printImage) {
      logger.warn(`Figure '${id}' does not have a 'poster' property. Print media will not render a fallback image for id: ${id}`)
    }

    const posterSrc = printImage.paths.internal
    const labelElement = figureLabel({ caption, id, label })
    const captionElement = figureCaption({ caption, content: labelElement, credit, mediaId, mediaType })

    // TODO: Actually do alt here?
    return html`
      <div class="q-figure__media-wrapper--${aspectRatio || 'widescreen'}">
        <img src="${posterSrc}" alt="" />
      </div>
      ${captionElement}
    `
  }
}
