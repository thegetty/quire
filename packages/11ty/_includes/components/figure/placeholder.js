import escape from 'html-escape'
import path from 'node:path'
import { html } from '#lib/common-tags/index.js'

export default function (eleventyConfig) {
  const figureLabel = eleventyConfig.getFilter('figureLabel')

  const { imageDir } = eleventyConfig.globalData.config.figures

  return function ({ alt, caption, id, label, mediaType, src }) {
    let imageElement

    if (src) {
      const imagePath = path.join(imageDir, src)
      imageElement = `
        <img
          id="${id}"
          class="q-figure__image"
          src="${imagePath}"
          alt="${escape(alt)}"
        />
      `
    } else {
      const imagePath = path.join(imageDir, 'icons', `${mediaType}.png`)
      imageElement = `
        <img src="${imagePath}" class="q-figure__media-fallback" alt="${escape(alt)}" />
      `
    }

    const labelElement = figureLabel({ caption, id, label })

    const captionElement = `
      <figcaption class="quire-figure__caption">
        <a href="${src}" target="_blank">${src}</a>
      </figcaption>
    `

    return html`${imageElement}${labelElement}${captionElement}`
  }
}
