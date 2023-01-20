const { html } = require('~lib/common-tags')
const path = require('path')

/**
 * Renders image slides with captions for display in a <q-lightbox> element
 *
 * @param      {Object} eleventyConfig  eleventy configuration
 *
 * @param      {Array} figures
 * @return     {String}  An HTML <img> element
 */
module.exports = function(eleventyConfig) {
  const annotationsUI = eleventyConfig.getFilter('annotationsUI')
  const figureImageElement = eleventyConfig.getFilter('figureImageElement')
  const figureAudioElement = eleventyConfig.getFilter('figureAudioElement')
  const figureTableElement = eleventyConfig.getFilter('figureTableElement')
  const figureVideoElement = eleventyConfig.getFilter('figureVideoElement')
  const markdownify = eleventyConfig.getFilter('markdownify')

  const assetsDir = path.join(eleventyConfig.dir.input, '_assets/images')

  return async function(figures) {
    if (!figures) return ''

    figures = figures.map((figure) => ({
      preset: 'zoom',
      ...figure
    }))

    const slideElement = async (figure) => {
      const {
        aspect_ratio: aspectRatio='widescreen',
        caption,
        credit,
        id,
        label,
        mediaType
      } = figure

      const isAudio = mediaType === 'soundcloud'
      const isVideo = mediaType === 'video' || mediaType === 'vimeo' || mediaType === 'youtube'

      const figureElement = async (figure) => {
        switch (true) {
          case mediaType === 'soundcloud':
            return figureAudioElement(figure)
          case mediaType === 'table':
            return `<div class="overflow-container">${await figureTableElement(figure)}</div>`
          case isVideo:
            return figureVideoElement(figure)
          case mediaType === 'image':
          default:
            return figureImageElement(figure)
        }
      }

      const labelSpan = label
        ? html`<span class="q-lightbox-slides__caption-label">${label}</span>`
        : ''
      const captionAndCreditSpan = caption || credit
        ? html`<span class="q-lightbox-slides__caption-content">${caption ? markdownify(caption) : ''} ${credit ? credit : ''}</span>`
        : ''
      const captionElement = labelSpan.length || captionAndCreditSpan.length
        ? html`
          <div class="q-lightbox-slides__caption">
            ${labelSpan}
            ${captionAndCreditSpan}
          </div>
        `
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
          data-lightbox-slide
          data-lightbox-slide-id="${id}"
        >
          <div class="${elementClasses}">
            ${await figureElement(figure)}
          </div>
          <div class="q-figure-slides__slide-ui">
            ${captionElement}
            ${annotationsUI({ figure, lightbox: true })}
          </div>
        </div>
      `
    }

    const slideElements = async () => {
      let slides = ''
      for (const figure of figures) {
        slides += await slideElement(figure)
      }
      return slides
    }

    return html`
      <div class="q-lightbox-slides">
        ${await slideElements()}
      </div>
    `
  }
}
