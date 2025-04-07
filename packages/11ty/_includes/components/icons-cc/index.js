import fs from 'fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { html } from '#lib/common-tags/index.js'

/**
 * Creative Commons SVG Icon
  The individual svg elements are assembled according to the specific license used:
  "CC 0", "CC BY", "CC BY-SA", "CC BY-ND", "CC BY-NC", "CC BY-NC-SA", or "CC BY-NC-ND".
 */
export default function (eleventyConfig) {
  const { config } = eleventyConfig.globalData

  return function () {
    if (!config.licenseIcons) return ''

    const ccIcons = fs
      .readdirSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'icons'))
      .map((filename) => {
        const id = path.basename(filename, '.svg')
        return fs
          .readFileSync(
            path.join(path.dirname(fileURLToPath(import.meta.url)), 'icons', filename),
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
