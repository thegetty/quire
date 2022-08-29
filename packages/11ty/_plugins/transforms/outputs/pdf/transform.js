const jsdom = require('jsdom')
const filterOutputs = require('../filter.js')
const truncate = require('~lib/truncate')
const writeOutput = require('./write')

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

  /**
   * Truncated page or section title for footer
   * @param  {Object} page
   * @return {String}       page title
   */
  const footerTitle = (page) => {
    const {
      label,
      short_title: shortTitle,
      title
    } = page
    const truncatedTitle = shortTitle || truncate(title, 35)
    return pageTitle({ label, title: truncatedTitle })
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
    const pageIndex = pdfPages.findIndex((path) => path === this.outputPath)
    const { document } = new JSDOM(content).window
    const mainElement = document.querySelector('main[data-output-path]')

    if (mainElement) {
      if (pageIndex !== -1) {
        const currentPage = collections.pdf[pageIndex]
        const { parentPage } = currentPage.data
        const sectionElement = document.createElement('section')
        sectionElement.innerHTML = mainElement.innerHTML
        for (className of mainElement.classList) {
          sectionElement.classList.add(className)
        }

        // set data attributes for PDF footer
        sectionElement.dataset.footerPageTitle = footerTitle(currentPage.data)
        if (parentPage) {
          sectionElement.dataset.footerSectionTitle = footerTitle(parentPage.data)
        }

        // set an id for anchor links to each section
        sectionElement.setAttribute('id', mainElement.getAttribute('id'))

        // transform relative links to anchor links
        transformRelativeLinks(sectionElement)

        // remove non-pdf content
        filterOutputs(sectionElement, 'pdf')
        collections.pdf[pageIndex].sectionElement = sectionElement
      }

      /**
       * Once this transform has been called for each PDF page
       * every item in the collection will have `sectionConent`
       */
      if (collections.pdf.every(({ sectionElement }) => !!sectionElement)) {
        writeOutput(collections.pdf)
      }
    }
  }

  // Return unmodified `content`
  return content
}
