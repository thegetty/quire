const { html } = require('common-tags')

/**
 * A shortcode for embedding a media player that supports video playback into the document.
 * @param {String} src  Source url for the video
 * @return {String}  An HTML <video> element
 */
module.exports = function(eleventyConfig, { src }) {
  const unsupported = 'Sorry, your browser does not support embedded videos.'

  return html`
    <video controls width="250">
      <source src="${src}" type="video/mp4"/>
      ${unsupported}
    </video>
  `
}
