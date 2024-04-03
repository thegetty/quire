const { html, oneLine } = require('~lib/common-tags')
const path = require('path')

/**
 * A shortcode for tombstone display of object data on an entry page
 */
module.exports = function(eleventyConfig, { page, key }) {
  const slugify = eleventyConfig.getFilter('slugify')

  const { config, objects } = eleventyConfig.globalData
  const { objectLinkText } = config.entryPage
  const pdfConfig = eleventyConfig.globalData.config.pdf

  return function (pageObjects = []) {
    const titleCase = eleventyConfig.getFilter('titleCase')
    const icon = eleventyConfig.getFilter('icon')
    const markdownify = eleventyConfig.getFilter('markdownify')
    const properties = objects.object_display_order

    const tableRow = (object, property) => {
      if (!object || !property || !object[property]) return ''

      return html`
        <tr>
          <td>${titleCase(property)}</td>
          <td>${markdownify(object[property].toString())}</td>
        </tr>
      `
    }

    const objectLink = (object) => object.link
      ? oneLine`
        <a class="button" href="${object.link}" target="_blank">
          ${objectLinkText} ${icon({ type: 'link', description: '' })}
        </a>`
      : ''

    let downloadLink = ''
    if ( (pdfConfig.pagePDF.output === true || page.pagePDFOutput === true) && pdfConfig.pagePDF.accessLinks.findIndex( (al) => al.header === true ) > -1 ) {

      const text = pdfConfig.pagePDF.accessLinks.find( al => al.header === true ).label
      const href = path.join( pdfConfig.outputDir, `${pdfConfig.filename}-${slugify(key)}.pdf` )
      downloadLink = oneLine`
              <a class="button" href="${ href }" target="_blank" data-outputs-exclude="epub,pdf" ><span>${ text }</span><svg class="quire-download__link__icon"><use xlink:href="#download-icon"></use></svg></a>`
    }
    
    // FIXME: Insert a pdf link if it's configured
    const table = (object) => html`
      <section class="quire-entry__tombstone">
        <div class="container">
          <table class="table is-fullwidth">
            <tbody>
              ${properties.map((property) => tableRow(object, property)).join('')}
            </tbody>
          </table>
          ${objectLink(object)}${downloadLink}
        </div>
      </section>
    `
    return pageObjects.map((object) => table(object)).join('')
  }
}
