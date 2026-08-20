import { html } from '#lib/common-tags/index.js'

/**
 * Copyright info
 * @param  {Object} eleventyConfig
 * @param  {Object} data
 *
 * @return {String}
 */
export default function (eleventyConfig) {
  const { config, publication } = eleventyConfig.globalData

  const copyrightLicensing = eleventyConfig.getFilter('copyrightLicensing')
  const getFigureMedia = eleventyConfig.getFilter('getFigureMedia')
  const licenseIcons = eleventyConfig.getFilter('licenseIcons')
  const markdownify = eleventyConfig.getFilter('markdownify')
  const slugify = eleventyConfig.getFilter('slugify')

  return function (params) {
    const copyright = publication.copyright
      ? `<p>${markdownify(publication.copyright)}</p>`
      : ''

    const publisherImages = publication.publisher.flatMap(({ logo, name }) => {
      const logoFigure = getFigureMedia(`logo-${slugify(name)}`)

      if (!logo || !logoFigure) return []

      const media = logoFigure.derivatives?.full
      if (!media) return []

      const { internal: imagePath } = media.paths
      if (!imagePath) return []

      return [`<img src="${imagePath}" class="copyright__publisher-logo" alt="${name}" />`]
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
