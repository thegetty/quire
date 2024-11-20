const { html } = require('common-tags')
const chalkFactory = require('~lib/chalk')
const logger = chalkFactory('Figure Annotations UI')

module.exports = function (eleventyConfig) {
  const slugify = eleventyConfig.getFilter('slugify')

  const supportedInputTypes = ['checkbox', 'radio']

  /**
   * Render an annotation checkbox or radio input
   * @param  {Object} annotation Figure annotation object
   * @param  {Number} index The index of the annotation in the figure annotation set
   * @param  {String} input The input type, 'radio' or 'checkbox'
   * @param  {String} name The input name attribute. Prefixed with `lightbox-` when rendered inside a lightbox
   */
  return function ({ annotation, index, input, name }) {
    const { id, label, selected, type, uri } = annotation

    if (!label) {
      logger.error(`Annotation label is required. Annotation id: ${id}`)
      return ''
    }

    if (!supportedInputTypes.includes(input)) {
      logger.error(`The provided input "${input}" for annotation "${id}" is not supported. Input must be ${supportedInputTypes.join(' or ')}.`)
      return ''
    }

    const checked = selected || (input === 'radio' && index === 0)
    const elementId = `${name}-${id}`
    const inputId = `${elementId}-input`

    return html`
      <div class="annotations-ui__input-wrapper" id="${elementId}">
        <input
          class="annotations-ui__input"
          id="${inputId}"
          name="${name}"
          type="${input}"
          value="${uri}"
          data-annotation-id="${id}"
          data-annotation-type="${type}"
          ${checked ? 'checked' : ''}
        />
        <label
          class="annotations-ui__label"
          for="${inputId}"
        >
          ${label}
        </label>
      </div>
    `
  }

}
