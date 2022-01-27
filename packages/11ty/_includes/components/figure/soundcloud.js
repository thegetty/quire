const { html } = require('common-tags')

/**
 * Renders an iframe element with the SoundCloud audio player
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  globalData      global data
 * @param      {Object}  figure          The figure
 * @return     {String}  HTML to display a SoundCloud player
 */
module.exports = function (context, figure) {
  const { eleventyConfig, globalData: { config } } = context
  const qfigurecaption = eleventyConfig.getFilter('qfigurecaption')
  const qfigureimage = eleventyConfig.getFilter('qfigureimage')
  const qfigureplaceholder = eleventyConfig.getFilter('qfigureplaceholder')
  const qfigurelabel = eleventyConfig.getFilter('qfigurelabel')

  const { id, label, media_id } = figure

  const src = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${media_id}`

  if (!media_id) {
    console.warn(`Error: Cannot render SoundCloud component without 'media_id'. Check that figures data for id: ${id} has a valid 'media_id'`)
    return ''
  }

  /**
   * Render a placeholder for EPUB and PDF output
   */
  if (config.params.epub || config.params.pdf) {
    return html`
      ${qfigureplaceholder(figure)}
      <figcaption class="quire-figure__caption caption">
        <a href="${src}" target="_blank">${src}</a>
      </figcaption>
    `
  }

  return html`
    <iframe
      allow="autoplay"
      frameborder="no"
      height="166"
      scrolling="no"
      src="${src}&auto_play=false&color=%23ff5500&hide_related=true&show_comments=false&show_reposts=false&show_teaser=false&show_user=false"
      width="100%"
    ></iframe>
    ${label && config.params.figureLabelLocation === 'on-top' ? qfigurelabel(figure) : '' }
    ${qfigurecaption(figure)}
  `
}
