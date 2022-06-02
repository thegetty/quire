const path = require('path')
const { html } = require('common-tags')

module.exports = function(eleventyConfig) {
  const imageDir = eleventyConfig.globalData.config.params.imageDir

  return function(license) {
    if (license === '0') license = 'zero'

    const alt = `CC-${license.toUpperCase()}`
    const src = path.join(imgDir, 'icons', `${license}.png`)

    const foreignObject = license !== 'CC'
      ? html`
          <foreignObject width="135" height="30">
            <img src="${src}" alt="${alt}" />
          </foreignObject>
        `
      : ''

    if (license && config.params.licenseIcons) {
      const licenseAbbreviations = license.abbreviation.split(' ')

      for (abbr of licenseAbbreviations) {
        let licenseIcon = eleventyConfig.getFilter(abbr)
        licenseIcons+=licenseIcon()
      }
    }

    return html`
      <a class="quire-copyright__icon__link" href="${license.url}" rel="license" target="_blank">
        <svg class="quire-copyright__icon">
          <switch>
            <use xlink:href="#${license}"></use>
            ${foreignObject}
          </switch>
        </svg>
      </a>
    `
  }
}
