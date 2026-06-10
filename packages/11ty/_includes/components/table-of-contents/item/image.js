import { html } from '#lib/common-tags/index.js'
import path from 'node:path'

/**
 * Renders a TOC item image
 *
 * @param      {Object} eleventyConfig eleventy configuration
 *
 * @param      {Object} params `figure` data from `figures.yaml`
 * @property   {String} alt The alt text for the image
 * @property   {String} src The src path for the image
 *
 * @return {String} TOC image markup
 */
export default function (eleventyConfig) {
  return function (figureMedia) {
    let { alt, derivatives, src: canonSrc } = figureMedia
    let height, width, src

    switch (true) {
      case derivatives?.thumbnail?.paths !== undefined
        && derivatives?.thumbnail?.dimensions !== undefined:
        const { thumbnail } = derivatives
        const { dimensions, paths } = thumbnail

        height = dimensions.height
        width = dimensions.width
        src = paths.internal

        break

      case Boolean(canonSrc):
        src = canonSrc
        break

      default: 
        return ''
    }

    return html`
      <div class="card-image">
        <figure class="image">
          <img alt="${alt}"
               height="${height}"
               width="${width}"
               src="${src}"
          />
        </figure>
      </div>
    `
  }
}
