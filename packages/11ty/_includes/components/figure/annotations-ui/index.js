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
  return function({ figure, lightbox=false }) {
    const { annotations } = figure
    if (!annotations || !annotations.length) return ''
    const fieldsets = annotations.map(({ input, items, title='', type }, index) => {
      const nameParts = [figure.id, index]
      if (lightbox) nameParts.unshift('lightbox')
      const name = nameParts.join('-')
      const options = items
        .map((annotation, index) => figureOption({ annotation, index, input, name }))
        .join('\n')
      return html`
        <fieldset class="annotations-ui">
          <legend>${title}</legend>
          ${options}
        </fieldset>
      `
    }).join('\n')
    return html`<form>${fieldsets}</form>`
  }
}
