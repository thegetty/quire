const jsdom = require('jsdom')
const { JSDOM } = jsdom
const filterOutputs = require('../filter.js')
const writeOutput = require('./write')

/**
 * A function to transform and write Eleventy content for pdf
 *
 * @param      {Object}  collections  Eleventy collections object
 * @param      {String}  content      Output content
 * @return     {Array}   The transformed content string
 */
module.exports = function(eleventyConfig, collections, content) {
  const slugify = eleventyConfig.getFilter('slugify')
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

  /**
   * Transform urls to point to original files
   *
   * @param      {HTMLElement}  element
   */
  const transformUrls = (element) => {
    const nodes = element.querySelectorAll('[src]')
    nodes.forEach((el) => {
      const url = el.getAttribute('src')
      el.setAttribute('src', `../_site${url}`)
    })

    return element
  }

  /**
   * Transform style urls to point to original files
   *
   * @param      {HTMLElement}  element
   */
  const transformStyleUrls = (element) => {
    const nodes = element.querySelectorAll('[style]')
    nodes.forEach((el) => {
      const style = el.getAttribute('style')
      el.setAttribute('style', style.replaceAll("url('/_assets/", "url('../_site/_assets/"))
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
        const sectionElement = document.createElement('section')
        sectionElement.innerHTML = mainElement.innerHTML
        for (className of mainElement.classList) {
          sectionElement.classList.add(className)
        }

        const pageLabelDivider = eleventyConfig.globalData.config.params
        const { label, title } = collections.pdf[pageIndex].data

        // set data attributes for PDF generation
        sectionElement.dataset.pageTitle = label
          ? `${label}${pageLabelDivider}${title}`
          : title

        // set an id for anchor links to each section
        sectionElement.setAttribute('id', mainElement.getAttribute('id'))

        // transform relative links to anchor links
        transformRelativeLinks(sectionElement)

        // remove non-pdf content
        filterOutputs(sectionElement, 'pdf')
        collections.pdf[pageIndex].sectionElement = sectionElement

        // transform src urls
        transformUrls(sectionElement)

        // transform style urls
        transformStyleUrls(sectionElement)
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
