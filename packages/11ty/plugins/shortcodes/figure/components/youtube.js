const { html } = require('common-tags')

/**
 * Renders an iframe element with a Youtube video player
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  globalData      global data
 * @param      {Object}  figure          The figure
 * @return     {String}  An HTML
 */
module.exports = function (eleventyConfig, { config }, figure) {
  const qfigurecaption = eleventyConfig.getFilter('qfigurecaption')
  const qfigureimage = eleventyConfig.getFilter('qfigureimage')
  const qfigureplaceholder = eleventyConfig.getFilter('qfigureplaceholder')
  const qfigurelabel = eleventyConfig.getFilter('qfigurelabel')

  const { aspectRatio, id, label, media_id } = figure
  const src = `https://youtu.be/${media_id}`

  if (!media_id) {
    console.warn(`Error: Cannot render Youtube component without 'media_id'. Check that figures data for id: ${id} has a valid 'media_id'`)
    return ''
  }

  /**
   * Render a placeholder for EPUB and PDF output
   */
  if (config.params.epub || config.params.pdf) {
    return oneLine`
      ${qfigureplaceholder(figure)}
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
    ${label && config.params.figureLabelLocation === 'on-top' ? qfigurelabel(figure) : ''}
    ${qfigurecaption(figure)}
  `
}
