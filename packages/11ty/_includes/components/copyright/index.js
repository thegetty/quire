const path = require('path')
const { html } = require('~lib/common-tags')

/**
 * Copyright info
 * @param  {Object} eleventyConfig
 * @param  {Object} data
 * 
 * @return {String}
 */
module.exports = function(eleventyConfig) {
  const { config, publication } = eleventyConfig.globalData

  const copyrightLicensing = eleventyConfig.getFilter('copyrightLicensing')
  const licenseIcons = eleventyConfig.getFilter('licenseIcons')
  const markdownify = eleventyConfig.getFilter('markdownify')

  return function (params) {
    const { imageDir } = config.figures

    const copyright = publication.copyright
      ? `<p>${markdownify(publication.copyright)}</p>`
      : ''

    const publisherImages = publication.publisher.flatMap(({ logo, name }) => {
      const imagePath = logo && path.join(imageDir, logo)
      return imagePath
        ? [`<img src="${imagePath}" class="copyright__publisher-logo" alt="${name}" />`]
        : []
    })

    const { license } = publication

    const printText = license.pdf_ebook_text
      ? markdownify(license.pdf_ebook_text)
      : copyrightLicensing()

    const screenText = license.online_text
      ? markdownify(license.online_text)
      : copyrightLicensing()

    return html`
      <div class="quire-copyright">
        ${publisherImages}
        ${copyright}
        ${config.licenseIcons && licenseIcons(license)}
        <div class="is-screen-only">
          ${screenText}
        </div>
        <div class="is-print-only">
          ${printText}
        </div>
      </div>
    `
  }
}
