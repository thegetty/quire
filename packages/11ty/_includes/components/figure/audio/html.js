import { html } from '#lib/common-tags/index.js'

/**
 * Renders an iframe element with the SoundCloud audio player
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  figure          The figure
 *
 * @return     {String}  An embedded SoundCloud player and a caption
 */
export default function (eleventyConfig) {
  const figureCaption = eleventyConfig.getFilter('figureCaption')
  const figureLabel = eleventyConfig.getFilter('figureLabel')
  const figureAudioElement = eleventyConfig.getFilter('figureAudioElement')

  return function ({ caption, credit, id, label, mediaId, mediaType, lazyLoading }) {
    const audioElement = figureAudioElement({ id, mediaId, mediaType, lazyLoading })
    const labelElement = figureLabel({ caption, id, label })
    const captionElement = figureCaption({ caption, content: labelElement, credit })

    return html`
      <div class="q-figure__media-wrapper">
        ${audioElement}
      </div>
      ${captionElement}
    `
  }
}
