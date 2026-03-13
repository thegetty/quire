import { html } from '#lib/common-tags/index.js'
import chalkFactory from '#lib/chalk/index.js'
import fs from 'fs'
import path from 'node:path'
import * as sass from 'sass'

const logger = chalkFactory('lightbox:styles')

/**
 * Lightbox Styles Tag
 *
 * @param      {Object}  eleventyConfig
 * @return     {Function} 11ty component returning a slotted `style` tag
 */
export default function (eleventyConfig) {
  const lightboxStylesPath = path.resolve('content/_assets/styles/components/q-lightbox.scss')

  let lightboxCSS = { css: '' }

  if (!fs.existsSync(lightboxStylesPath)) {
    logger.warn(`q-lightbox component styles were not found at ${lightboxStylesPath}, this may cause the lightbox to behave unexpectedly.`)
  } else {
    const sassOptions = {
      api: 'modern-compiler',
      loadPaths: [path.resolve('node_modules')],
      silenceDeprecations: [
        'color-functions',
        'global-builtin',
        'import',
        'legacy-js-api',
        'mixed-decls'
      ]
    }
    lightboxCSS = sass.compile(lightboxStylesPath, sassOptions)
  }

  return function () {
    if (!lightboxCSS) return

    return html`
      <style slot="lightbox-styles">
        ${lightboxCSS.css}
      </style>
    `
  }
}
