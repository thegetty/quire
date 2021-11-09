const { html } = require('common-tags')
const caption = require('./caption')
const label = require('./label')

/**
 * A shortcode for embedding a table into the document.
 * @param {String}
 * @return {String}  An HTML <table> element
 */
module.exports = function(eleventyConfig, { data }) {
  const markdownify = eleventyConfig.getFilter('markdownify')

  const tableSrc = path.join('static', imageDir, data.src)
  // const figureId = 'deepzoomtable' | append: date
  // const modalLink = 'figureId' | prepend: '#'
  const title = markdownify(caption)

  const figcaption = caption(data)
  const figureLabel = this.config.figureLabelLocation === 'on-top'
    ? label(data)}
    : ''

  const figureModal = (tableSrc) => html`
    <figure
      id="${figureId}"
      class="quire-figure leaflet-outer-wrapper mfp-hide notGet"
      title="${title}"
    >
      <div
        aria-label="Zoomable table"
        aria-live="polite"
        class="quire-deepzoom inset leaflet-inner-wrapper"
        id="js-${figureId}"
        role="application"
      >
        <figure class="leaflet-table">${tableSrc}</figure>
      </div>
    </figure>
    <a
      class="inline popup"
      data-type="inline"
      href="${modalLink}"
      title="${title}"
    >
      ${tableSrc}
    </a>
  `

  return html`
    <figure class="quire-figure__table">
      ${tableSrc}
    </figure>
  `
}
