import path from 'path'
const { html } = require('common-tags')

module.exports = function(eleventyConfig, globalData) {
  const { config } = globalData
  const qfigurelabel = eleventyConfig.getFilter('qfigurelabel')

  return function(params) {
    const { figure } = params
    const { id, label, media_type: mediaType, src } = figure

    let element;
    if (src) {
      const imagePath = path.join(config.params.imageDir, src)
      element = `<img
          id="${id}"
          class="q-figure__image"
          src="${imagePath}"
          alt="${alt}"
        />`
    } else {
      const imagePath = path.join(config.params.imageDir, 'icons', `${mediaType}.png`)
      element = `<div class="q-figure__media-fallback">
          <div class="placeholder">
            <span class="fallback-image">
              <img src="${imagePath}" />
            </span>
          </div>
        </div>`
    }

    const labelElement = label && config.params.figureLabelLocation === 'on-top' ? qfigurelabel({ figure }) : ''

    return html`${element}${labelElement}`
  }
}
