const path = require('path')
const { html } = require('~lib/common-tags')

module.exports = function(eleventyConfig) {
  const { imageDir } = eleventyConfig.globalData.config.params

  return function(license) {
    const abbreviations = license.abbreviation.split(' ')

    const icons = abbreviations.map((abbr) => {
      switch (abbr) {
        case '0':
          abbr = `cc-zero`
          break
        case 'CC':
          abbr = 'cc'
          break
        default:
          abbr = `cc-${abbr.toLowerCase()}`
      }

      const src = path.join(imageDir, 'icons', `${abbr}.png`)

      return `
        <switch>
          <use xlink:href="#${abbr}"></use>
        </switch>
      `
    })

    return html`
      <a class="quire-copyright__icon__link" href="${license.url}" rel="license" target="_blank">
        <svg class="quire-copyright__icon">
          ${icons.join(' ')}
        </svg>
      </a>
    `
  }
}
