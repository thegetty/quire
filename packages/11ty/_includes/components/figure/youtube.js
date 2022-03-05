const { html } = require('common-tags')

/**
 * Renders an iframe element with a Youtube video player
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  globalData      global data
 * @param      {Object}  figure          The figure
 * @return     {String}  An HTML
 */
module.exports = function(eleventyConfig, globalData) {
  const figurecaption = eleventyConfig.getFilter('figurecaption')
  const figureimage = eleventyConfig.getFilter('figureimage')
  const figureplaceholder = eleventyConfig.getFilter('figureplaceholder')
  const figurelabel = eleventyConfig.getFilter('figurelabel')

  const { figureLabelLocation, epub, pdf } = globalData.config.params

  return function({ figure }) {
    const { aspectRatio, id, label, media_id } = figure
    const src = `https://youtu.be/${media_id}`

    if (!media_id) {
      console.warn(`Error: Cannot render Youtube component without 'media_id'. Check that figures data for id: ${id} has a valid 'media_id'`)
      return ''
    }

    /**
     * Render a placeholder for EPUB and PDF output
     */
    if (epub || pdf) {
      return oneLine`
        ${figureplaceholder(figure)}
        <figcaption class="quire-figure__caption caption">
          <a href="https://youtu.be/${media_id}" target="_blank">${src}</a>
        </figcaption>
      `
    }

    return html`
      <div class="q-figure__media-wrapper--${ aspectRatio || 'widescreen' }">
        <iframe
          allowfullscreen
          class="q-figure__media"
          frameborder="0"
          src="https://www.youtube.com/embed/${media_id}?rel=0&amp;showinfo=0"
        ></iframe>
      </div>
      ${label && figureLabelLocation === 'on-top' ? figurelabel({ figure }) : ''}
      ${figurecaption({ figure })}
    `
  }
}
