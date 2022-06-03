const path = require('path')
const { html } = require('common-tags')

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

      const foreignObject = abbr !== 'cc'
        ? html`
            <foreignObject width="135" height="30">
              <img src="${src}" alt="${abbr.toUpperCase()}" />
            </foreignObject>
          `
        : ''

      return `
        <switch>
          <use xlink:href="#${abbr}"></use>
          ${foreignObject}
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
