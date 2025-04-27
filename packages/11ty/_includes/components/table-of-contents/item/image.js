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
  const { imageDir } = eleventyConfig.globalData.config.figures
  return function ({ alt = '', src = '', isStatic = false }) {
    if (!imageDir || !src) return ''
    const imgPath = src.startsWith('http') || isStatic ? src : path.join(imageDir, src)
    return html`
      <div class="card-image">
        <figure class="image">
          <img src="${imgPath}" alt="${alt}" />
        </figure>
      </div>
    `
  }
}
