const { html } = require('~lib/common-tags')
const path = require('path')

module.exports = function (figure, imageDir) {
  const {
    alt='',
    src=''
  } = figure

  const imageSrc = src.startsWith('http') ? src : path.join(imageDir, src)

  return html`
    <img alt="${alt}" class="q-figure__image" src="${imageSrc}" />
  `
}
