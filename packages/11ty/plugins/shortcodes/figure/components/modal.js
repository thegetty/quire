const { html } = require('common-tags')

/**
 * A shortcode for embedding a table into the document.
 * @param {String}
 * @return {String}  An HTML <table> element
 */
module.exports = function(eleventyConfig, data) {
  const markdownify = eleventyConfig.getFilter('markdownify')
  const modalLink = eleventyConfig.getFilter('qfiguremodallink')

  const tableSrc = path.join('static', imageDir, data.src)
  // const figureId = 'deepzoomtable' | append: date
  const title = markdownify(caption)

  return html`
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
        <figure class="leaflet-table">{% include tableSrc %}</figure>
      </div>
    </figure>
    ${modalLink(data.content)}
  `
}
