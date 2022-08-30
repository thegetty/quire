const { html } = require('~lib/common-tags')
const chalkFactory = require('~lib/chalk')

/**
 * Renders an iframe element with the SoundCloud audio player
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  figure          The figure
 * @return     {String}  HTML to display a SoundCloud player
 */
module.exports = function(eleventyConfig) {
  const figureCaption = eleventyConfig.getFilter('figureCaption')
  const figureImage = eleventyConfig.getFilter('figureImage')
  const figureLabel = eleventyConfig.getFilter('figureLabel')
  const figurePlaceholder = eleventyConfig.getFilter('figurePlaceholder')
  const figureSoundcloudElement = eleventyConfig.getFilter('figureSoundcloudElement')

  return function({ caption, credit, id, label, media_id }) {
    const labelElement = figureLabel({ caption, id, label })
    const captionElement = figureCaption({ caption, content: labelElement, credit })
    const soundcloudElement = figureSoundcloudElement({ id, media_id })

    return html`
      <div class="q-figure__media-wrapper">
        ${soundcloudElement}
      </div>
      ${captionElement}
    `
  }
}
