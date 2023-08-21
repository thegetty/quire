const jsdom = require('jsdom')
const filterOutputs = require('../filter.js')
const truncate = require('~lib/truncate')
const writer = require('./write')

const { JSDOM } = jsdom

/**
 * A function to transform and write Eleventy content for pdf
 *
 * @param      {Object}  collections  Eleventy collections object
 * @param      {String}  content      Output content
 * @return     {Array}   The transformed content string
 */
module.exports = function(eleventyConfig, collections, content) {
  const pageTitle = eleventyConfig.getFilter('pageTitle')
  const slugify = eleventyConfig.getFilter('slugify')

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
   */
  const setDataAttributes = (page, element) => {
    const { dataset } = element
    const { parentPage } = page.data

    dataset.footerPageTitle = formatTitle(page.data)

    if (parentPage) {
      dataset.footerSectionTitle = formatTitle(parentPage.data)
    }
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

  sectionElement.innerHTML = mainElement.innerHTML

  for (const className of mainElement.classList) {
    sectionElement.classList.add(className)
  }

  setDataAttributes(currentPage, sectionElement)

  // set an id for anchor links to each section
  sectionElement.setAttribute('id', pageId)

  // transform relative links to anchor links
  transformRelativeLinks(sectionElement)

  // prefix footnote attributes to prevent duplicates
  prefixFootnotes(sectionElement, pageId)

  // remove non-pdf content
  filterOutputs(sectionElement, 'pdf')
  collections.pdf[pageIndex].svgSymbolElements = Array.from(svgSymbolElements)
  collections.pdf[pageIndex].sectionElement = sectionElement

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
