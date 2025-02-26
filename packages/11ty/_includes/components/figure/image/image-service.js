import escape from 'html-escape'
import { html } from '#lib/common-tags/index.js'

/**
 * Image Service Web Component
 * @param      {Object} eleventyConfig  eleventy configuration
 *
 * @param      {Object} params
 * @property   {String} figure
 * @return     {String}  An <image-service> element
 */
export default function (eleventyConfig) {
  return function ({
    alt = '',
    height = '',
    info,
    preset = 'responsive',
    region = '',
    virtualSizes = '',
    width = ''
  }) {
    return html`
      <image-service 
        alt="${escape(alt)}"
        class="q-figure__image"
        height="${height}"
        preset="${preset}"
        region="${region}"
        src="${info}"
        virtual-sizes="${virtualSizes}"
        width="${width}">
      </image-service>`
  }
}
