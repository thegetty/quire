const { html } = require('~lib/common-tags')
const chalkFactory = require('~lib/chalk')

/**
 * Renders an iframe element with the SoundCloud audio player
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  figure          The figure
 *
 * @return     {String}  An embedded SoundCloud player and a caption
 */
module.exports = function(eleventyConfig) {
  const figureAudioElement = eleventyConfig.getFilter('figureAudioElement')

  return function({ id, mediaId, mediaType }) {
    const audioElement = figureAudioElement({ id, mediaId, mediaType })

    return html`
      <div class="q-figure__media-wrapper">
        ${audioElement}
      </div>
    `
  }
}
