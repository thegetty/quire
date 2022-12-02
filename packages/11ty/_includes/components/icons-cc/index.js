const fs = require('fs')
const path = require('path')
const { html } = require('~lib/common-tags')

/**
 * Creative Commons SVG Icon
  The individual svg elements are assembled according to the specific license used:
  "CC 0", "CC BY", "CC BY-SA", "CC BY-ND", "CC BY-NC", "CC BY-NC-SA", or "CC BY-NC-ND".
 */
module.exports = function(eleventyConfig) {
  const { config } = eleventyConfig.globalData

  return function() {
    if (!config.licenseIcons) return ''

    const ccIcons = fs
      .readdirSync(path.join(__dirname, 'icons'))
      .map((filename) => {
        const id = path.basename(filename, '.svg')
        return fs
          .readFileSync(
            path.join(__dirname, 'icons', filename),
            { encoding: 'utf8' }
          )
          .replace('<svg', `<symbol id="${id}"`)
          .replace('</svg', '</symbol')
      })

    return html`
      <svg style="display:none" data-outputs-exclude="epub,pdf">
        ${ccIcons.join(' ')}
      </svg>
    `
  }
}

