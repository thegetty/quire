const { html } = require('common-tags')

/**
 * @todo This component isn't included anywhere - did we refactor it away accidentally or purposefully?
 * 
 * @param {String}
 * @return {String}  An HTML <table> element
 */
module.exports = function(eleventyConfig, globalData) {
  const markdownify = eleventyConfig.getFilter('markdownify')
  const modalLink = eleventyConfig.getFilter('qfiguremodallink')
  const { config } = globalData

  return function(params) {
    const { content, figure } = params
    const tableSrc = path.join('static', config.params.imageDir, figure.src)
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
      ${modalLink({ figure, content })}
    `
  }
}
