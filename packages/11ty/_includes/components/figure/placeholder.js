const path = require('path')
const { html } = require('common-tags')

module.exports = function(eleventyConfig) {
  const figurelabel = eleventyConfig.getFilter('figurelabel')

  const { figureLabelLocation, imageDir } = eleventyConfig.globalData.config.params

  return function({ alt, caption, id, label, media_type: mediaType, src }) {
    let imageElement

    if (src) {
      const imagePath = path.join(imageDir, src)
      imageElement = `
        <img
          id="${id}"
          class="q-figure__image"
          src="${imagePath}"
          alt="${alt}"
        />
      `
    } else {
      const imagePath = path.join(imageDir, 'icons', `${mediaType}.png`)
      imageElement = `
        <img src="${imagePath}" class="q-figure__media-fallback" />
      `
    }

    const labelElement = label && figureLabelLocation === 'on-top'
      ? figurelabel({ caption, id, label })
      : ''

    const captionElement = `
      <figcaption class="quire-figure__caption">
        <a href="${src}" target="_blank">${src}</a>
      </figcaption>
    `

    return html`${imageElement}${labelElement}${captionElement}`
  }
}
