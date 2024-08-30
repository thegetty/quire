const { html } = require('~lib/common-tags')
const path = require('path')

/**
 * Renders a figure slide with caption for `slides` slot of <q-lightbox> element
 *
 * @param      {Object} eleventyConfig  eleventy configuration
 *
 * @param      {Array} figures
 * @return     {String}  An HTML element for the slide of this figure
 */
module.exports = function(eleventyConfig) {
  const annotationsUI = eleventyConfig.getFilter('annotationsUI')
  const figureImageElement = eleventyConfig.getFilter('figureImageElement')
  const figureAudioElement = eleventyConfig.getFilter('figureAudioElement')
  const figureTableElement = eleventyConfig.getFilter('figureTableElement')
  const figureVideoElement = eleventyConfig.getFilter('figureVideoElement')
  const markdownify = eleventyConfig.getFilter('markdownify')

  const assetsDir = path.join(eleventyConfig.dir.input, '_assets/images')

  return async function(figure) {
    if (!figure) return ''

    const {
      aspect_ratio: aspectRatio='widescreen',
      caption,
      credit,
      id,
      isSequence,
      label,
      mediaType
    } = figure

    const isAudio = mediaType === 'soundcloud'
    const isVideo = mediaType === 'video' || mediaType === 'vimeo' || mediaType === 'youtube'

    const figureElement = async (fig) => {
      switch (true) {
        case mediaType === 'soundcloud':
          return figureAudioElement(fig)
        case mediaType === 'table':
          return `<div class="overflow-container">${await figureTableElement(fig)}</div>`
        case isVideo:
          return figureVideoElement(fig)
        case mediaType === 'image':
        default:
          return figureImageElement(fig, { preset: 'zoom', interactive: true })
      }
    }

    const labelSpan = label
      ? html`<span class="q-lightbox-slides__caption-label">${markdownify(label)}</span>`
      : ''
    const captionAndCreditSpan = caption || credit
      ? html`<span class="q-lightbox-slides__caption-content">${caption ? markdownify(caption) : ''} ${credit ? markdownify(credit) : ''}</span>`
      : ''
    const captionElement = labelSpan.length || captionAndCreditSpan.length
      ? html`
        <div class="q-lightbox-slides__caption">
          ${labelSpan}
          ${captionAndCreditSpan}
        </div>
      `
      : ''
    const annotationsElement = !isSequence
      ? annotationsUI({ figure, lightbox: true })
      : ''

    const elementBaseClass = 'q-lightbox-slides__element'
    const elementClasses = [
      elementBaseClass,
      mediaType ? `${elementBaseClass}--${mediaType}` : '',
      isAudio ? `${elementBaseClass}--audio` : '',
      isVideo ? `${elementBaseClass}--video ${elementBaseClass}--${aspectRatio}` : ''
    ].join(' ')

    return html`
      <div
        class="q-lightbox-slides__slide"
        slot="slides"
        data-lightbox-slide
        data-lightbox-slide-id="${id}"
      >
        <div class="${elementClasses}">
          ${await figureElement(figure)}
        </div>
        <div class="q-figure-slides__slide-ui">
          ${captionElement}
          ${annotationsElement}
        </div>
      </div>
    `
  }
}
