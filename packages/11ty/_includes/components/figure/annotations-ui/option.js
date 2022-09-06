const { html } = require('common-tags')
const chalkFactory = require('~lib/chalk')
const { error } = chalkFactory('Figure Annotations UI')

module.exports = function (eleventyConfig) {
  const slugify = eleventyConfig.getFilter('slugify')
  const { locale } = eleventyConfig.globalData.iiifConfig

  const supportedInputTypes = ['checkbox', 'radio']

  /**
   * Render an annotation checkbox or radio input
   * @param  {Object} figure
   * @param  {Object} annotation
   */
  return function ({ annotation, figure, index, input }) {
    const { id, label, selected, type, url } = annotation

    if (!label) {
      error(`Annotation label is required. Figure id: ${figure.id}`)
    }

    if (!supportedInputTypes.includes(input)) {
      error(`The provided input "${input}" for figure "${figure.id}" is not supported. Input must be ${supportedInputTypes.join(' or ')}.`)
    }

    const checked = selected ||
      (input === "radio" && index === 0) ||
      (input === "checkbox" && type === "choice" && index === 0)
    const elementId = `${slugify(figure.id)}--${slugify(label)}`

    return html`
      <div class="annotations-ui__input-wrapper" id="${elementId}">
        <input
          ${checked ? 'checked' : ''}
          class="annotations-ui__input"
          data-annotation-type="${type}"
          id="${url}"
          name="${figure.id}"
          type="${input}"
        />
        <label
          class="annotations-ui__label"
          for="${url}"
        >
          ${label}
        </label>
      </div>
    `
  }

}
