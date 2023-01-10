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
    const nodes = element.querySelectorAll('a')
    nodes.forEach((a) => {
      const url = a.getAttribute('href')
      a.setAttribute('href', slugify(url).replace(/^([^#])/, '#$1'))
    })
    return element
  }

  const pdfPages = collections.pdf.map(({ outputPath }) => outputPath)

  if (pdfPages.includes(this.outputPath)) {
    const { document } = new JSDOM(content).window
    const mainElement = document.querySelector('main[data-output-path]')
    const pageIndex = pdfPages.findIndex((path) => path === this.outputPath)

    if (mainElement) {
      if (pageIndex !== -1) {
        const currentPage = collections.pdf[pageIndex]
        const sectionElement = document.createElement('section')

        sectionElement.innerHTML = mainElement.innerHTML

        for (const className of mainElement.classList) {
          sectionElement.classList.add(className)
        }

        setDataAttributes(currentPage, sectionElement)

        // set an id for anchor links to each section
        sectionElement.setAttribute('id', mainElement.dataset.pageId)

        // transform relative links to anchor links
        transformRelativeLinks(sectionElement)

        // remove non-pdf content
        filterOutputs(sectionElement, 'pdf')
        collections.pdf[pageIndex].sectionElement = sectionElement
      }

      /**
       * Once this transform has been called for each PDF page
       * every item in the collection will have `sectionContent`
       */
      if (collections.pdf.every(({ sectionElement }) => !!sectionElement)) {
        writeOutput(collections.pdf)
      }
    }
  }

  // Return unmodified `content`
  return content
}
