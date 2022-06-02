const path = require('path')
const { html } = require('common-tags')

module.exports = function(eleventyConfig) {
  const imageDir = eleventyConfig.globalData.config.params.imageDir

  return function(license) {
    const abbreviations = license.abbreviation.split(' ')

    const icons = abbreviations.map((abbr) => {
      if (abbr === '0') abbr = 'zero'

      const alt = `CC-${abbr.toUpperCase()}`
      const src = path.join(imgDir, 'icons', `${abbr}.png`)

      const foreignObject = abbr !== 'CC'
        ? html`
            <foreignObject width="135" height="30">
              <img src="${src}" alt="${alt}" />
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
