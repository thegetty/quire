const { html } = require('common-tags')

/**
 * A shortcode for embedding a table into the document.
 * @param {String}
 * @return {String}  An HTML <table> element
 */
module.exports = function(eleventyConfig, globalData) {
  const figurecaption = eleventyConfig.getFilter('figurecaption')
  const figurelabel = eleventyConfig.getFilter('figurelabel')
  const markdownify = eleventyConfig.getFilter('markdownify')

  const { figureLabelLocation, imageDir } = globalData.config.params

  return function({ figure }) {
    // const figureId = 'deepzoomtable' | append: date
    const modalLink = `#${figure.id}`
    const tableSrc = path.join('static', imageDir, figure.src)
    const title = markdownify(caption)

    const figcaption = figurecaption({ figure })
    const figureLabel = figureLabelLocation === 'on-top'
      ? figurelabel({ figure })
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
