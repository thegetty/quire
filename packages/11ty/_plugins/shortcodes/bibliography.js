const { html, oneLine } = require('~lib/common-tags')
const chalkFactory = require('~lib/chalk')
const checkFormat = require('../collections/filters/output.js')
const path = require('path')

const logger = chalkFactory('configuration:bibliography')

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

  // Are the footer links set?
  if (config.pagePDF.accessLinks.find((al) => al.footer === true) === undefined )  {
    return false
  }

  // Return the core logic check
  return (config.pagePDF.output === true && frontmatterSetting !== false) || frontmatterSetting === true
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
  const { outputs, page_pdf_output: pagePDFOutput } = page.data
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
  return function (referenceIds = [],outputs,pagePDFOutput) {

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

    const bibliographyHeading = () => heading ? `<h2>${heading}</h2>` : ''
    const bibliographyItems = sortReferences(Object.values(page.citations))
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

    const downloadLink = () => {
      if (!checkPagePDF(pdfConfig, outputs, pagePDFOutput) || page.data.layout === 'cover') {
        return ''
      }
        
      const text = pdfConfig.pagePDF.accessLinks.find((al) => al.footer === true).label
      const href = path.join(pdfConfig.outputDir, `${pdfConfig.filename}-${slugify(page.data.key)}.pdf`)

      return oneLine`<div class="quire-download quire-download-footer-link" data-outputs-exclude="epub,pdf">
        <a class="quire-download__link" href="${href}" download><span>${text}</span><svg class="quire-download__link__icon"><use xlink:href="#download-icon"></use></svg></a>
      </div>`
    }

    /**
     * Render: the list if there are citations or page references, d/l link, or nothing
     */
    switch (true) {
      case bibliographyItems.length > 0:
        return html`
          <div class="quire-page__content__references backmatter">
            ${bibliographyHeading()}
            ${displayShort ? definitionList() : unorderedList()}
            ${downloadLink()}
          </div>
        `
      case downloadLink() !== '':
        return html`${downloadLink()}`
      default:
        return ''
    }
  }
}
