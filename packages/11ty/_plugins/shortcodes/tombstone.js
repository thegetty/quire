const { html, oneLine } = require('~lib/common-tags')
const checkFormat = require('../collections/filters/output.js')
const path = require('path')

/**
 * @function checkPagePDF
 * 
 * @param {Object} config pdf object from Quire config
 * @param {Array<string>,string,undefined} outputs outputs setting from page frontmatter 
 * @param {bool} frontmatterSetting pdf page setting from page frontmatter
 * 
 * Check if the PDF link should be generated for this page
 */
const checkPagePDF = (config, outputs, frontmatterSetting) => {

  // Is the output being created?
  if (!checkFormat('pdf', { data: { outputs } })) {
    return false 
  }

  // Are the header links set?
  if (config.pagePDF.accessLinks.find((al) => al.header === true) === undefined)  {
    return false
  }

  // Return the core logic check
  return (config.pagePDF.output === true && frontmatterSetting !== false) || frontmatterSetting === true
}

/**
 * A shortcode for tombstone display of object data on an entry page
 */
module.exports = function(eleventyConfig, { page }) {
  const slugify = eleventyConfig.getFilter('slugify')

  const { config, objects } = eleventyConfig.globalData
  const { objectLinkText } = config.entryPage
  const { pdf: pdfConfig } = config

  return function (pageObjects = [], key, outputs, pagePDFOutput) {
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
    if ( checkPagePDF(pdfConfig,outputs,pagePDFOutput) ) {
      
      const text = pdfConfig.pagePDF.accessLinks.find( al => al.header === true ).label
      const href = path.join( pdfConfig.outputDir, `${pdfConfig.filename}-${slugify(key)}.pdf` )
      downloadLink = oneLine`
        <a class="button" href="${href}" target="_blank" data-outputs-exclude="epub,pdf" download><span>${text}</span><svg class="quire-download__link__icon"><use xlink:href="#download-icon"></use></svg></a>
      `
    }
    
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
