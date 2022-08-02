const { html } = require('~lib/common-tags')
const chalkFactory = require('~lib/chalk')

/**
 * Renders an image instead of a video player
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  figure          The figure
 * @return     {String}  An HTML
 */
module.exports = function(eleventyConfig) {
  const figurecaption = eleventyConfig.getFilter('figurecaption')
  const figurelabel = eleventyConfig.getFilter('figurelabel')

  const { figureLabelLocation } = eleventyConfig.globalData.config.params

  return function({ aspect_ratio: aspectRatio, caption, credit, id, label, mediaType, poster}) {
    const isEmbed = mediaType === 'vimeo' || mediaType === 'youtube'

    return html`
      <div class="q-figure__media-wrapper--${ aspectRatio || 'widescreen' }">
        <img src="${poster}" />
      </div>
      ${label && figureLabelLocation === 'on-top' ? figurelabel({ caption, id, label }) : ''}
      ${figurecaption({ caption, credit })}
    `
  }
}
