const jsdom = require('jsdom')
const { JSDOM } = jsdom
const writePDF = require('./write')

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

module.exports = function(collections, content) {
  const htmlPages = collections.html.map(({ outputPath }) => outputPath)
  const pdfPages = collections.pdf.map(({ outputPath }) => outputPath)

  if (pdfPages.includes(this.outputPath)) {
    const pageIndex = pdfPages.findIndex((path) => path === this.outputPath)
    const sectionElement = getSectionElement(content)

    if (sectionElement) {
      const identifier = sectionElement.getAttribute('data-output-path')

      if (pageIndex !== -1) {
        sectionElement.removeAttribute('data-output-path')
        sectionElement.setAttribute('id', collections.pdf[pageIndex].url)
        transformRelativeLinks(sectionElement)
        collections.pdf[pageIndex].sectionElement = sectionElement
      }

      /**
       * Once this transform has been called for each PDF page
       * every item in the collection will have `sectionConent`
       */
      if (collections.pdf.every(({ sectionElement }) => !!sectionElement)) {
        writePDF(collections.pdf)
      }
    }
  }

  return htmlPages.includes(this.outputPath) ? content : undefined
}
