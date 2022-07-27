const { html } = require('~lib/common-tags')
const chalkFactory = require('~lib/chalk')

/**
 * Renders an iframe element with a Youtube video player
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  figure          The figure
 * @return     {String}  An HTML
 */
module.exports = function(eleventyConfig) {
  const figurecaption = eleventyConfig.getFilter('figurecaption')
  const figureimage = eleventyConfig.getFilter('figureimage')
  const figureplaceholder = eleventyConfig.getFilter('figureplaceholder')
  const figurelabel = eleventyConfig.getFilter('figurelabel')

  const { figureLabelLocation } = eleventyConfig.globalData.config.params

  return function({ aspect_ratio: aspectRatio, caption, credit, id, label, media_id: mediaId }) {

    if (!mediaId) {
      console.warn(`Error: Cannot render Youtube component without 'media_id'. Check that figures data for id: ${id} has a valid 'media_id'`)
      return ''
    }

    return html`
      <div class="q-figure__media-wrapper--${ aspectRatio || 'widescreen' }">
        <iframe
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          class="q-figure__media"
          frameborder="0"
          src="https://www.youtube-nocookie.com/embed/${mediaId}"
        ></iframe>
      </div>
      ${label && figureLabelLocation === 'on-top' ? figurelabel({ caption, id, label }) : ''}
      ${figurecaption({ caption, credit })}
    `
  }
}
