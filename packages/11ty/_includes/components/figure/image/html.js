import { html } from '#lib/common-tags/index.js'

/**
 * Renders an image with a caption and annotations UI
 *
 * @param      {Object} eleventyConfig  eleventy configuration
 * @param      {Object} figure          The figure object
 *
 * @return     {String}  HTML containing  a `figureImageElement`, a caption and annotations UI
 */
export default function (eleventyConfig) {
  const annotationsUI = eleventyConfig.getFilter('annotationsUI')
  const figureCaption = eleventyConfig.getFilter('figureCaption')
  const figureImageElement = eleventyConfig.getFilter('figureImageElement')
  const figureLabel = eleventyConfig.getFilter('figureLabel')
  const figureModalLink = eleventyConfig.getFilter('figureModalLink')

  return async function (figure) {
    const {
      annotations,
      caption,
      credit,
      id,
      isSequence,
      label
    } = figure

    const labelElement = figureLabel({ id, label, isSequence })
    const interactive = (annotations ?? []).length > 0

    /**
     * Construct the HTML figure:
     * - Wrap image in modal link
     * - Add caption
     * - Add optional annotations UI
     **/

    let imageElement = figureImageElement(figure, { interactive })
    imageElement = figureModalLink({ content: imageElement, id })

    const captionElement = figureCaption({ caption, content: labelElement, credit })
    const annotationsUIElement = !isSequence ? annotationsUI({ figure, lightbox: true }) : ''

    return html`
      ${imageElement}
      ${captionElement}
      ${annotationsUIElement}
    `
  }
}
