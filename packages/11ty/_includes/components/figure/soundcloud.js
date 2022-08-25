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

  return function({ caption, credit, id, label, media_id }) {
    const src = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${media_id}`

    if (!media_id) {
      console.warn(`Error: Cannot render SoundCloud component without 'media_id'. Check that figures data for id: ${id} has a valid 'media_id'`)
      return ''
    }

    const labelElement = figureLabel({ caption, id, label })
    const captionElement = figureCaption({ caption, content: labelElement, credit })

    return html`
      <div class="q-figure__media-wrapper">
        <iframe
          allow="autoplay"
          frameborder="no"
          height="166"
          scrolling="no"
          src="${src}&auto_play=false&color=%23ff5500&hide_related=true&show_comments=false&show_reposts=false&show_teaser=false&show_user=false"
          width="100%"
        ></iframe>
      </div>
      ${captionElement}
    `
  }
}
