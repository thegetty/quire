const { html } = require('~lib/common-tags')

/**
 * Render the Digirati <image-service> web component
 * @see {@link https://iiif-canvas-panel.netlify.app/docs/components/single-image-service Image Service Documentation}
 *
 * @param      {Object} params
 * @property   {String} figure
 * @return     {String}  An <image-service> element
 */
module.exports = function (figure) {
  const {
    alt='',
    height='',
    preset='responsive',
    region='',
    iiif,
    virtualSizes='',
    width=''
  } = figure

  return html`
    <image-service
      alt="${alt}"
      class="q-figure__image"
      height="${height}"
      preset="${preset}"
      region="${region}"
      src="${iiif.info}"
      virtual-sizes="${virtualSizes}"
      width="${width}">
    </image-service>`
}
