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
    const imageDir = config.params.imageDir

    const copyright = publication.copyright
      ? `<p>${markdownify(publication.copyright)}</p>`
      : ''

    const publisherImages = publication.publisher.flatMap((publisher) => {
      const alt = publisher.name
      const src = path.join(imageDir, publisher.logo)
      return publisher.logo
        ? [`<img src="${src}" class="copyright__publisher-logo" alt="${alt}" />`]
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
        ${config.params.licenseIcons && licenseIcons(license)}
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
