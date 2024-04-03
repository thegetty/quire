const { html } = require('~lib/common-tags')
const path = require('path')

/**
 * Publication page header
 *
 * @param      {Object}  eleventyConfig
 */
module.exports = function(eleventyConfig) {
  const contributors = eleventyConfig.getFilter('contributors')
  const pageTitle = eleventyConfig.getFilter('pageTitle')
  const slugify = eleventyConfig.getFilter('slugify')

  const { labelDivider } = eleventyConfig.globalData.config.pageTitle
  const { imageDir } = eleventyConfig.globalData.config.figures

  const pdfConfig = eleventyConfig.globalData.config.pdf

  return function (params) {
    const {
      byline_format: bylineFormat,
      image,
      label,
      pageContributors,
      subtitle,
      title,
      page_pdf_output: pagePDFOutput,
      key: pageKey,
    } = params

    const classes = ['quire-page__header', 'hero']

    if (title == 'title page' || title == 'half title page') {
      classes.push('is-screen-only')
    }

    const pageLabel = label
      ? `<span class="label">${label}<span class="visually-hidden">${labelDivider}</span></span>`
      : ''

    const imageElement = image
      ? html`
          <section
            class="${classes} hero__image"
           style="background-image: url('${path.join(imageDir, image)}');"
          >
          </section>
        `
      : ''

    const contributorsElement = pageContributors
      ? html`
          <div class="quire-page__header__contributor">
            ${contributors({ context: pageContributors, format: bylineFormat })}
          </div>
        `
      : ''

    // FIXME: Also check the PDF config 
    let downloadLink = ''

    if ( (pdfConfig.pagePDF.output === true || pagePDFOutput === true) && pdfConfig.pagePDF.accessLinks.findIndex( (al) => al.header === true ) > -1 ) {

      const text = pdfConfig.pagePDF.accessLinks.find( al => al.header === true ).label
      const href = path.join( pdfConfig.outputDir, `${pdfConfig.filename}-${slugify(pageKey)}.pdf` )
      downloadLink = html`
            <div class="quire-download" data-outputs-exclude="epub,pdf">
              <a class="quire-download__link" href="${ href }" target="_blank" ><span>${ text }</span><svg class="quire-download__link__icon"><use xlink:href="#download-icon"></use></svg></a>
            </div>`

    }

    return html`
      <section class="${classes}">
        <div class="hero-body">
          <h1 class="quire-page__header__title" id="${slugify(title)}">
            ${pageLabel}
            ${pageTitle({ title, subtitle })}
          </h1>
          ${contributorsElement}
          ${downloadLink}
        </div>
      </section>
      ${imageElement}
    `
  }
}
