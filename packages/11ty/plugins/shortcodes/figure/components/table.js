const { html } = require('common-tags')

/**
 * A shortcode for embedding a table into the document.
 * @param {String}
 * @return {String}  An HTML <table> element
 */
module.exports = function(eleventyConfig, globalData) {
  const { config } = globalData
  const qfigurecaption = eleventyConfig.getFilter('qfigurecaption')
  const qfigurelabel = eleventyConfig.getFilter('qfigurelabel')
  const markdownify = eleventyConfig.getFilter('markdownify')

  return function(params) {
    const { figure } = params
    // const figureId = 'deepzoomtable' | append: date
    const modalLink = `#${figure.id}`
    const tableSrc = path.join('static', config.params.imageDir, figure.src)
    const title = markdownify(caption)

    const figcaption = qfigurecaption({ figure })
    const figureLabel = config.params.figureLabelLocation === 'on-top'
      ? qfigurelabel({ figure })
      : ''

    const figureModal = (tableSrc) => html`
      <figure
        id="${figureId}"
        class="q-figure leaflet-outer-wrapper mfp-hide notGet"
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
      <figure class="q-figure__table">
        ${tableSrc}
      </figure>
    `
  }
}
