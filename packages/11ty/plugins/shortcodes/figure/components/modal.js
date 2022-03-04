const { html } = require('common-tags')

/**
 * @todo This component isn't included anywhere - did we refactor it away accidentally or purposefully?
 * 
 * @param {String}
 * @return {String}  An HTML <table> element
 */
module.exports = function(eleventyConfig, globalData) {
  const markdownify = eleventyConfig.getFilter('markdownify')
  const modalLink = eleventyConfig.getFilter('figuremodallink')

  const { imageDir } = globalData.config.params

  return function({ content, figure }) {
    // const figureId = 'deepzoomtable' | append: date
    const tableSrc = path.join('static', imageDir, figure.src)
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
