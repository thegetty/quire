const jsdom = require('jsdom')
const filterOutputs = require('../filter.js')
const truncate = require('~lib/truncate')
const writer = require('./write')

const chalkFactory = require('~lib/chalk')
const logger = chalkFactory('pdf:transform')

const { JSDOM } = jsdom

/**
 * A function to transform and write Eleventy content for pdf
 *
 * @param      {Object}  collections  Eleventy collections object
 * @param      {String}  content      Output content
 * @return     {Array}   The transformed content string
 */
module.exports = async function(eleventyConfig, collections, content) {
  const pageTitle = eleventyConfig.getFilter('pageTitle')
  const slugify = eleventyConfig.getFilter('slugify')
  const citation = eleventyConfig.getFilter('citation')
  const pdfConfig = eleventyConfig.globalData.config.pdf
  const slugifyIds = eleventyConfig.getFilter('slugifyIds')

  const writeOutput = writer(eleventyConfig)

  /**
   * Truncated page or section title for footer
   * @param  {Object} page
   * @return {String} Formatted page or section title
   */
  const formatTitle = ({ label, short_title: shortTitle, title }) => {
    const truncatedTitle = shortTitle || truncate(title, 35)
    return pageTitle({ label, title: truncatedTitle })
  }

  /**
   * Sets data attribute used for PDF footer
   * @see `_assets/styles/print.css`
   *
   * @param  {Object}       page     The page being transformed
   * @param  {HTMLElement}  element  HTML element on which to set data attributes
   * 
   * `pagePdf` = true | false will determine whether this page generates a one-off PDF
   * 
   */
  const setDataAttributes = (page, element, generatePagedPDF) => {
    const { dataset } = element
    const { parentPage, pagePDFOutput, layout } = page.data
    const { pagePDF } = pdfConfig

    dataset.footerPageTitle = formatTitle(page.data)

    if (parentPage) {
      dataset.footerSectionTitle = formatTitle(parentPage.data)
    }

    if (!generatePagedPDF) {
      return
    }

    if (layout === "cover") {
      logger.warn(`${page.data.page.inputPath} uses a \`cover\` layout, this will only appear in the full publication PDF`)
      return
    }

    dataset.pagePdf = true

  }

  /**
   * Transform relative links to anchor links
   *
   * @param      {HTMLElement}  element
   */
  const transformRelativeLinks = (element) => {
    const nodes = element.querySelectorAll('a:not(.footnote-backref, .footnote-ref-anchor)')
    nodes.forEach((a) => {
      const url = a.getAttribute('href')
      a.setAttribute('href', slugify(`page-${url}`).replace(/^([^#])/, '#$1'))
    })
    return element
  }

  /**
   * Prefix footnote hrefs and ids to guarantee unique references in PDF output
   * 
   * @param {HTMLElement} element 
   * @param {String} prefix 
   */
  const prefixFootnotes = (element, prefix) => {
    const footnoteItems = element.querySelectorAll('.footnote-item')
    footnoteItems.forEach((item) => {
      const id = item.getAttribute('id')
      item.setAttribute('id', `${prefix}-${id}`)
    })
    const footnoteBackrefs = element.querySelectorAll('.footnote-backref')
    footnoteBackrefs.forEach((item) => {
      const href = item.getAttribute('href')
      item.setAttribute('href', `#${prefix}-${href.replace(/^#/, '')}`)
    })
    const footnoteRefAnchors = element.querySelectorAll('.footnote-ref-anchor')
    footnoteRefAnchors.forEach((item) => {
      const href = item.getAttribute('href')
      const id = item.getAttribute('id')
      item.setAttribute('href', `#${prefix}-${href.replace(/^#/, '')}`)
      item.setAttribute('id', `${prefix}-${id}`)
    })
    // 
  }

  /**
   * @function trimLeadingSeparator
   * 
   * Trims the publication URL path from @src attribs and style background-image URLs 
   * 
   **/
  const trimLeadingSeparator = (document) => {

    const urlPath = eleventyConfig.globalData.publication.pathname

    /**
     * Trim func, removes either the deploy path or just the leading slash 
     */
    const trimDeployPathComponentOrSlash = (srcAttr) => {
      // - /foo/_assets/image.jpg -> _assets/image.jpg -- FIXME: How is it that the background-image doesn't need fixed?
      // - /_assets/image.jpg -> _assets/image.jpg
      // - Passes URLs with protocols
      switch (true) {
        case srcAttr.startsWith(urlPath):
          return srcAttr.substr(urlPath.length)
        case srcAttr.startsWith('/'):
          return srcAttr.substr(1)
        default:
          return srcAttr
      }
    }

    document.querySelectorAll('[src]').forEach((asset) => {
      const src = asset.getAttribute('src')
      asset.setAttribute('src', trimDeployPathComponentOrSlash(src))
    })

    document.querySelectorAll('[style*="background-image"]').forEach((element) => {
      const backgroundImageUrl = element.style.backgroundImage.match(/[\(](.*)[\)]/)[1] || ''
      element.style.backgroundImage = `url('${trimDeployPathComponentOrSlash(backgroundImageUrl)}')`
    })

  }

  /**
   * @function normalizeCoverPageData
   * 
   * @param {Object} pageData - page data object
   * @param {Object} pdfConfig - configuration for the pdf
   * 
   * Returns {Object} data formatted for the layout at _layouts/pdf-cover-page.liquid
   *   
   **/
  function normalizeCoverPageData(page,pdfConfig) { 

    const { pagePDFCoverPageCitationStyle } = page.data

    // NB: `id` must match the @id slug scheme in `base.11ty.js` so the cover pages have the same keys
    const id = `page-${slugify(page.data.pageData.url)}` 
    const title = pageTitle({...page.data, label: ""})
    const accessURL = page.data.canonicalURL
    const contributors = JSON.stringify(page.data.pageContributors ?? '[]')     
    const license = page.data.publication.license.name // FIXME: Need a license *text* ala https://www.getty.edu/publications/cultural-heritage-mass-atrocities/downloads/pages/CunoWeiss_CHMA_part-1-02-macgregor.pdf 
    const copyright = page.data.publication.copyright
    const pageCitation = (pagePDFCoverPageCitationStyle ?? pdfConfig?.pagePDF?.coverPageCitationStyle ) ? citation({context: 'page',page, type: pagePDFCoverPageCitationStyle ?? pdfConfig?.pagePDF?.coverPageCitationStyle }) : ''

    return { id, title, accessURL, contributors, license, copyright, citation: pageCitation }

  }

  const pdfPages = collections.pdf.map(({ outputPath }) => outputPath)

  // Returning content allows subsequent transforms to process it unmodified
  if (!pdfPages.includes(this.outputPath)) return content

  const { document } = new JSDOM(content).window
  const mainElement = document.querySelector('main[data-output-path]')
  const svgSymbolElements = document.querySelectorAll('body > svg')
  const pageIndex = pdfPages.findIndex((path) => path === this.outputPath)

  // Returning content allows subsequent transforms to process it unmodified
  if (!mainElement || pageIndex === -1) return content

  const currentPage = collections.pdf[pageIndex]
  const sectionElement = document.createElement('section')
  const pageId = mainElement.dataset.pageId

  const hasPagePDF = (currentPage.data.pagePDFOutput === true) || (pdfConfig.pagePDF.output === true && currentPage.data.pagePDFOutput !== false)
  const hasCoverPage = (currentPage.data.pagePDFOutput === true) || (pdfConfig.pagePDF.output === true && currentPage.data.pagePDFOutput !== false)

  sectionElement.innerHTML = mainElement.innerHTML

  for (const className of mainElement.classList) {
    sectionElement.classList.add(className)
  }

  setDataAttributes(currentPage, sectionElement, generatePagedPDF)

  // set an id for anchor links to each section
  sectionElement.setAttribute('id', pageId)

  // transform relative links to anchor links
  transformRelativeLinks(sectionElement)

  // prefix footnote attributes to prevent duplicates
  prefixFootnotes(sectionElement, pageId)

  // Final cleanups: remove non-pdf content, remove image leading slashes, slugify it all
  filterOutputs(sectionElement, 'pdf')  
  trimLeadingSeparator(sectionElement)
  slugifyIds(sectionElement)

  collections.pdf[pageIndex].svgSymbolElements = Array.from(svgSymbolElements).map( el => el.outerHTML )
  collections.pdf[pageIndex].sectionElement = sectionElement.outerHTML

  if (hasPagePDF && hasCoverPage) {
    collections.pdf[pageIndex].coverPageData = normalizeCoverPageData(currentPage,pdfConfig)         
  }

  /**
   * Once this transform has been called for each PDF page
   * every item in the collection will have `sectionContent`
   */
  if (collections.pdf.every(({ sectionElement }) => !!sectionElement)) {
    writeOutput(collections.pdf)
  }

  // Return unmodified `content`
  return content
}
