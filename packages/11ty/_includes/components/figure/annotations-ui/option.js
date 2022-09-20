const { html } = require('common-tags')
const chalkFactory = require('~lib/chalk')
const logger = chalkFactory('Figure Annotations UI')

module.exports = function (eleventyConfig) {
  const slugify = eleventyConfig.getFilter('slugify')
  const { locale } = eleventyConfig.globalData.iiifConfig

  const supportedInputTypes = ['checkbox', 'radio']

  /**
   * Render an annotation checkbox or radio input
   * @param  {Object} figure
   * @param  {Object} annotation
   */
  return function ({ annotation, index, input, name }) {
    const { id, label, selected, type, url } = annotation

    if (!label) {
      logger.error(`Annotation label is required. Annotation id: ${id}`)
      return ''
    }

    if (!supportedInputTypes.includes(input)) {
      logger.error(`The provided input "${input}" for annotation "${id}" is not supported. Input must be ${supportedInputTypes.join(' or ')}.`)
      return ''
    }

    const checked = selected || (input === "radio" && index === 0)
    const elementId = `${name}--${id}`
    const inputId = `input-${elementId}`

    return html`
      <div class="annotations-ui__input-wrapper" id="${elementId}">
        <input
          class="annotations-ui__input"
          id="${inputId}"
          name="${name}"
          type="${input}"
          value="${url}"
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
