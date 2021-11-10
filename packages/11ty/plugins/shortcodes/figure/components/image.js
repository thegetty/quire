const { html } = require('common-tags')
const path = require('path')

/**
 * Renders an <img> element
 *
 * @param      {Object}   data    Image alt text and src properties
 * @return     {String}  An HTML <img> element
 */
module.exports = function (eleventyConfig, { config }, figure) {
  const { alt='', src='' } = figure
  const imageSrc = path.join('/_assets/img', src)

  const qfigurecaption = eleventyConfig.getFilter('qfigurecaption')
  const qfigurelabel = eleventyConfig.getFilter('qfigurelabel')

  const labelElement = qfigurelabel(figure)
  const imageCaptionElement = (config.params.figureLabelLocation === 'below') 
    ? qfigurecaption(figure, labelElement) 
    : qfigurecaption(figure)

  return html`
    <img alt="${alt}" class="q-figure__image" src="${imageSrc}"/>
    ${imageCaptionElement}
  `
}
