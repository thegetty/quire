const path = require('path')
/**
 * Copyright info
 * @param  {Object} eleventyConfig
 * @param  {Object} data
 * 
 * @return {String}
 */
module.exports = function(eleventyConfig) {
  const copyrightLicensing = eleventyConfig.getFilter('copyrightLicensing')
  const markdownify = eleventyConfig.getFilter('markdownify')

  return function (params) {
    const { config, publication } = eleventyConfig.globalData

    const publisherImages = publication.publisher.filter((item) => item.logo).map(({ logo }) => {
      return `<img src="${ path.join(config.params.imageDir, logo) }" class="quire-copyright__icon__logo" alt="logo" />`
    }).join('')

    const copyright = publication.copyright ? `<p>${markdownify(publication.copyright)}</p>` : ''

    const { license } = publication

    let licenseIcons = ''
    if (license && config.params.licenseIcons) {
      const licenseAbbreviations = license.abbreviation.split(' ')
      licenseIcons += `<a rel="license" class="quire-copyright__icon__link" href="${ license.url }" target="_blank">`
      licenseIcons += `<svg class="quire-copyright__icon">`
      for (abbr of licenseAbbreviations) {
        let licenseIcon = eleventyConfig.getFilter(abbr)
        licenseIcons+=licenseIcon()
      }
      licenseIcons += `</svg></a>`
    }

    let licenseText = ''

    if (license.online_text) {
      licenseText+= `
        <div class="is-screen-only">
          ${ markdownify(license.online_text) }
        </div>
      `
    } else {
      licenseText+=copyrightLicensing()
    }

    if (license.pdf_ebook_text) {
      licenseText += `
        <div class="is-print-only">
          ${ markdownify(license.pdf_ebook_text) }
        </div>
      `
    } else {
      licenseText += `
        <div class="is-print-only">
          ${copyrightLicensing()}
        </div>
      `
    }

    return `
    <div class="quire-copyright">
      ${publisherImages}
      ${copyright}
      ${licenseIcons}
      ${licenseText}
    </div>
  `
  }
}
