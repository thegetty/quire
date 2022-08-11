const { html } = require('common-tags')
/**
 * UI for selecting IIIF annotations and choices
 * 
 * @param  {Object} eleventyConfig
 * @return {String} HTML radio or checkbox input elements
 */

const inputElement = (figure, item) => {
  const label = item.label.en ? item.label.en[0] : item.label
  const checked = item.selected || item.id === figure.iiif.choiceId
  const type = figure.input || 'radio'
  return html`
    <input
      id="${item.id}"
      type="${type}"
      name="${figure.id}"
      value="${item.id}"
      ${checked ? 'checked' : ''}
      class="annotation-option"
    >
    <label for="${item.id}">${label}</label>
  `
}

module.exports = function(eleventyConfig) {
  /**
   * @param  {Object} figure
   * @property  {String} input radio||checkbox
   */
  return function(figure) {
    const { annotations=[], choices=[] } = figure.iiif

    if (!annotations.length && !choices.length) return ''

    const annotationsUI = annotations.map((item) => inputElement(figure, item))
    const choicesUI = choices.map((item) => inputElement(figure, item))

    return html`
      ${annotationsUI}
      ${choicesUI}
    `
  }
}
