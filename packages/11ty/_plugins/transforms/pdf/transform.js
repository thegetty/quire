const jsdom = require('jsdom')
const { JSDOM } = jsdom
const writeOutput = require('./write')

/**
 * Get the page `section` element
 * @param  {String} content Page HTML
 * @return {Object}
 */
const getSectionElement = (content) => {
  const { document } = new JSDOM(content).window
  return document.querySelector('section[data-output-path]')
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
    a.setAttribute('href', `#${url}`)
  })
  return element
}

/**
 * A function to tranform Eleventy output content
 *
 * @param      {Object}  collections  Eleventy collections object
 * @param      {String}  content      Output content
 * @return     {Array}   The transformed content string
 */
module.exports = function(collections, content) {
  const htmlPages = collections.html.map(({ outputPath }) => outputPath)
  const pdfPages = collections.pdf.map(({ outputPath }) => outputPath)

  if (pdfPages.includes(this.outputPath)) {
    const pageIndex = pdfPages.findIndex((path) => path === this.outputPath)
    const sectionElement = getSectionElement(content)

    if (sectionElement) {
      if (pageIndex !== -1) {
        delete sectionElement.dataset.outputPath

        const pageLabelDivider = '. ' // eleventyConfig.globalData.config.params
        const { label, title } = collections.pdf[pageIndex].data

        // set data attributes for PDF generation
        sectionElement.dataset.pageTitle = label
          ? `${label}${pageLabelDivider}${title}`
          : title

        // set an id for anchor links to each section
        sectionElement.setAttribute('id', collections.pdf[pageIndex].url)

        // transform relative links to anchor links
        transformRelativeLinks(sectionElement)

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

  return htmlPages.includes(this.outputPath) ? content : undefined
}
