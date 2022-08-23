const { html } = require('common-tags')

/**
 * Render UI elements for selecting IIIF annotations or choices, 
 * which are a type of annotation but need their own UI
 * 
 * @param  {Object} eleventyConfig
 * @return {String} HTML radio or checkbox input elements
 */

module.exports = function(eleventyConfig) {
  const figureOption = eleventyConfig.getFilter('figureOption')

  /**
   * @param  {Object} figure
   */
  return function(figure) {
    const { annotations } = figure
    if (!annotations || !annotations.length) return ''
    return annotations.map(({ input, items, type }) => {
      const options = 
        items.map((item, index) => figureOption({ figure, index, item }))
      return html`
        <div class="annotations-ui">
          ${options}
        </div>
      `
    })
  }
}
