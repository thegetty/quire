const jsdom = require('jsdom')
const filterOutputs = require('../filter.js')
const writeOutputs = require('./write')

const { JSDOM } = jsdom

/**
 * A function to transform and write Eleventy content for epub
 *
 * @param      {Object}  collections  Eleventy collections object
 * @param      {String}  content      Output content
 * @return     {Array}   The unmodified content string
 */
module.exports = function(eleventyConfig, collections, content) {

  const epubPages = collections.epub.map(({ outputPath }) => outputPath)

  if (epubPages.includes(this.outputPath)) {
    const { document } = new JSDOM(content).window
    const mainElement = document.querySelector('main[data-output-path]')
    const pageIndex = epubPages.findIndex((path) => path === this.outputPath)

    if (mainElement) {
      if (pageIndex !== -1) {
        const currentPage = collections.epub[pageIndex]
        const sectionElement = document.createElement('section')

        sectionElement.innerHTML = mainElement.innerHTML

        for (className of mainElement.classList) {
          sectionElement.classList.add(className)
        }

        // remove non-epub content
        filterOutputs(sectionElement, 'epub')
        collections.epub[pageIndex].sectionElement = sectionElement
      }
      /**
       * Once this transform has been called for each epub page
       * every item in the collection will have `sectionConent`
       */
      if (collections.epub.every(({ sectionElement }) => !!sectionElement)) {
        writeOutputs(collections.epub)
      }
    }
  }

  // Return unmodified `content`
  return content
}
