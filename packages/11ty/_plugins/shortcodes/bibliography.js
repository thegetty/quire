const path = require('path')
const { html, oneLine } = require('~lib/common-tags')
const chalkFactory = require('~lib/chalk')

const logger = chalkFactory('configuration:bibliography')

const checkFormat = require('../collections/filters/output.js')

/**
 * @function checkPagePDF
 * 
 * @param {Object} config pdf object from Quire config
 * @param {Array<string>,string,undefined} outputs outputs setting from page frontmatter 
 * @param {bool} frontmatterSetting pdf page setting from page frontmatter
 * 
 * Check if the PDF link should be generated for this page
 **/
const checkPagePDF = (config,outputs,frontmatterSetting) => {

  // Is the output being created?
  if ( !checkFormat('pdf',{data:{outputs}}) ) { 
    return false 
  }

  // Are the footer links set?
  if ( config.pagePDF.accessLinks.find( (al) => al.footer === true ) === undefined )  {
    return false
  }

  // Return the core logic check
  return ( config.pagePDF.output === true && frontmatterSetting !== false ) || frontmatterSetting === true

}

/**
 * Renders a bibliography of references from page citations.
 *
 * @param      {Object}  eleventyConfig
 */
module.exports = function (eleventyConfig, { page }) {
  const markdownify = eleventyConfig.getFilter('markdownify')
  const slugify = eleventyConfig.getFilter('slugify')
  const sortReferences = eleventyConfig.getFilter('sortReferences')

  const entries = eleventyConfig.globalData.references
    ? eleventyConfig.globalData.references.entries
    : []
  const { pdf: pdfConfig } = eleventyConfig.globalData.config

  const { outputs, page_pdf_output: pagePDFOutput } = page
  const { displayOnPage, displayShort, heading } = page.data.config.bibliography
  /**
   * bibliography shortcode
   * @example {% bibliography citations %}
   *
   * Nota bene: the front matter property for additional page level references
   * is `citations` to avoid conflicts with the global data `references.yaml`
   * and for consistency with the {% cite %} shortcode
   *
   * @param  {Array}  referenceIds  An array of `references.yaml` entry ids
   *                                to include in the rendered bibliography
   */
  return function (referenceIds = [],pagePDFOutput) {
    if (!page.citations && !referenceIds) return

    if (!displayOnPage) {
      page.citations
        ? logger.info(`A bibiliography of citations on ${page.inputPath} is not being displayed there, because 'config.bibliography.displayOnPage' on that page or in config.yaml, is set to false.`)
        : ''
      return ''
    }

    /**
     * The page citations array is created when the `cite` shortcode is used;
     * ensure that it exists in cases where there are only page references.
     */
    page.citations ??= {}

    /**
     * Add `citations` from template front-matter to the array of citations
     * for inclusion in the rendered page bibliography
     */
    referenceIds.forEach((id) => {
      const entry = entries.find((entry) => entry.id === id)
      if (entry) {
        page.citations[id] ??= { ...entry, short: entry.short || entry.id }
      }
    })

    const bibliographyItems = sortReferences(Object.values(page.citations))

    const bibliographyHeading = () => heading ? `<h2>${heading}</h2>` : ''

    const definitionList = () => html`
      <dl>
        ${bibliographyItems.map(({ id, short, full }) => `
          <dt id="${slugify(id)}">${markdownify(short)}</dt>
          <dd>${markdownify(full)}</dd>
        `)}
      </dl>
    `

    const unorderedList = () => html`
      <ul>
        ${bibliographyItems.map(({ id, short, full }) => `
          <li id="${slugify(id)}">${markdownify(full)}</li>
        `)}
      </ul>
    `

    let downloadLink = ''
    if ( checkPagePDF(pdfConfig,outputs,pagePDFOutput) && page.data.layout!=="cover" ) {
      
      const text = pdfConfig.pagePDF.accessLinks.find( al => al.footer === true ).label
      const href = path.join( pdfConfig.outputDir, `${pdfConfig.filename}-${slugify(page.data.key)}.pdf` )
      downloadLink = oneLine`<div class="quire-download quire-download-footer-link" data-outputs-exclude="epub,pdf">
        <a class="quire-download__link" href="${ href }" download><span>${ text }</span><svg class="quire-download__link__icon"><use xlink:href="#download-icon"></use></svg></a>
      </div>`

    }

    /**
     * Do not render the list when there are no citations nor page references
     */
    return bibliographyItems.length
      ? html`
          <div class="quire-page__content__references backmatter">
            ${bibliographyHeading()}
            ${displayShort ? definitionList() : unorderedList()}
            ${downloadLink}
          </div>
        `
      : ''
  }
}
