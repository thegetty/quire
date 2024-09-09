const chalkFactory = require('~lib/chalk')
const fs = require('fs')
const { html } = require('~lib/common-tags')
const path = require('path')
const sass = require('sass')

const logger = chalkFactory('lightbox:styles')

/**
 * Lightbox Styles Tag
 *
 * @param      {Object}  eleventyConfig
 * @return     {Function} 11ty component returning a slotted `style` tag
 */
module.exports = function (eleventyConfig) {
  const lightboxStylesPath = path.resolve('content/_assets/styles/components/q-lightbox.scss')

  let lightboxCSS = {css:''}

  if (!fs.existsSync(lightboxStylesPath)) {
    logger.warn(`q-lightbox component styles were not found at ${lightboxStylesPath}, this may cause the lightbox to behave unexpectedly.`)
  } else {
    lightboxCSS = sass.compile(lightboxStylesPath)
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
