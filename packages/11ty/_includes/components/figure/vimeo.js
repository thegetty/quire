const { html } = require('~lib/common-tags')
const chalkFactory = require('~lib/chalk')

/**
 * Renders an iframe element with a Vimeo video player
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  figure          Figure data
 * @return     {String}  An <iframe> element
 */
module.exports = function(eleventyConfig) {
  const figurecaption = eleventyConfig.getFilter('figurecaption')
  const figureimage = eleventyConfig.getFilter('figureimage')
  const figureplaceholder = eleventyConfig.getFilter('figureplaceholder')
  const figurelabel = eleventyConfig.getFilter('figurelabel')

  const { figureLabelLocation } = eleventyConfig.globalData.config.params

  return function({ aspect_ratio: aspectRatio, caption, credit, id, label, media_id: mediaId }) {

    if (!mediaId) {
      console.warn(`Error: Cannot render Vimeo component without 'media_id'. Check that figures data for id: ${id} has a valid 'media_id'`)
      return ''
    }
    // Sample Vimeo id: 672853278/b3f8d29d53
    const embedId = mediaId.replace('/', '?h=')

    return html`
      <div class="q-figure__media-wrapper--${ aspectRatio || 'widescreen' }">
        <iframe
          allow="fullscreen; picture-in-picture"
          allowfullscreen
          class="q-figure__media"
          frameborder="0"
          src="https://player.vimeo.com/video/${embedId}"
        ></iframe>
      </div>
      ${label && figureLabelLocation === 'on-top' ? figurelabel({ caption, id, label }) : ''}
      ${figurecaption({ caption, credit })}
    `
  }
}
