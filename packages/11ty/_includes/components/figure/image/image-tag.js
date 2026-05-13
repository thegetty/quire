import escape from 'html-escape'
import { html } from '#lib/common-tags/index.js'

/**
 * Image Tag for figures that are static images
 * @param      {Object} eleventyConfig  eleventy configuration
 *
 * @param      {Object} params `figure` data from `figures.yaml`
 * @property   {String} alt The alt text for the image
 * @property   {String} src The src path for the image
 * @return     {String}  An <img> element
 */
export default function (eleventyConfig) {
  return function ({ height, width, alt = '', src = '', isStatic = false, lazyLoading = 'lazy', lightbox = false }) {
    // Apply height/ width attributes if they exist
    const heightAttribute = height > 0 ? `height=${height}` : ''
    const widthAttribute = width > 0 ? `width=${width}` : ''

    return html`
      <img
        alt="${escape(alt)}"
        class="q-figure__image"
        decoding="async"
        loading="${lazyLoading}"
        src="${src}"
        ${heightAttribute}
        ${widthAttribute}
      />
    `
  }
}
