const path = require('path')
const { html } = require('common-tags')

module.exports = function(eleventyConfig, globalData) {
  const figurelabel = eleventyConfig.getFilter('figurelabel')

  const { figureLabelLocation, imageDir } = globalData.config.params

  return function({ figure }) {
    const { id, label, media_type: mediaType, src } = figure

    let element;

    if (src) {
      const imagePath = path.join(imageDir, src)
      element = `<img
          id="${id}"
          class="q-figure__image"
          src="${imagePath}"
          alt="${alt}"
        />`
    } else {
      const imagePath = path.join(imageDir, 'icons', `${mediaType}.png`)
      element = `<div class="q-figure__media-fallback">
          <div class="placeholder">
            <span class="fallback-image">
              <img src="${imagePath}" />
            </span>
          </div>
        </div>`
    }

    const labelElement = label && figureLabelLocation === 'on-top'
      ? figurelabel({ figure })
      : ''

    return html`${element}${labelElement}`
  }
}
