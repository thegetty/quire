const path = require('path')
const { html } = require('~lib/common-tags')

module.exports = function(eleventyConfig) {
  const { imageDir } = eleventyConfig.globalData.config.figures

  return function(license) {
    const abbreviations = license
      .abbreviation
      .toLowerCase()
      .split(' ')
      .flatMap((item) => item.split('-'))

    const icons = abbreviations.map((abbr) => {
      return html`
        <svg class="quire-copyright__icon">
          <use xlink:href="#${abbr}"></use>
        </svg>
      `
    })

    return html`
      <a class="quire-copyright__icon__link" href="${license.url}" rel="license" target="_blank">
        ${icons.join(' ')}
      </a>
    `
  }
}
