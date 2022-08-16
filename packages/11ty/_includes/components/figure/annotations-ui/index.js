const { html } = require('common-tags')

/**
 * Render UI elements for selecting IIIF annotations or choices, 
 * which are a type of annotation but need their own UI
 * 
 * @param  {Object} eleventyConfig
 * @return {String} HTML radio or checkbox input elements
 */

module.exports = function(eleventyConfig) {
  const figureoption = eleventyConfig.getFilter('figureoption')

  /**
   * @param  {Object} figure
   * @param {String} annotations|choices
   * @property  {String} input radio|checkbox
   */
  return function(figure, type) {
    const options = figure.iiif[type]

    if (!options || !options.length) return ''

    const optionElements = options.map((item) =>
      figureoption({
        figure,
        item,
        type
      })
    )

    return html`
      <div class="annotations-ui annotations-ui--${type}">
        ${optionElements}
      </div>
    `
  }
}
