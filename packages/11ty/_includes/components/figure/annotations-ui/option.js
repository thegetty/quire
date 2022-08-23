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
   * @param  {Object} item   Annotation item
   */
  return function ({ figure, index, item }) {
    const label = item.label[locale] ? item.label[locale][0] : item.label

    if (!label) {
      error(`Annotation label is required. Figure id: ${figure.id}`)
    }

    const inputType = figure.input || 'radio'

    if (!supportedInputTypes.includes(inputType)) {
      error(`The provided input "${inputType}" for figure "${figure.id}" is not supported. Input must be ${supportedInputTypes.join(' or ')}.`)
    }

    const id = `${slugify(figure.id)}--${slugify(label)}`
    const checked = item.selected || index === 0

    return html`
      <div class="annotations-ui__input-wrapper" id="${id}">
        <input
          ${checked ? 'checked' : ''}
          class="annotations-ui__input"
          data-annotation-type="${item.type}"
          id="${item.iiifId}"
          name="${figure.id}"
          type="${inputType}"
        />
        <label
          class="annotations-ui__label"
          for="${item.iiifId}"
        >
          ${label}
        </label>
      </div>
    `
  }

}
