const jsdom = require('jsdom')
const { JSDOM } = jsdom
const writePDF = require('./write')

/**
 * Get the page `section` element
 * @param  {String} content Page HTML
 * @return {Object}
 */
const getPageSection = function(content) {
  const { document: doc } = new JSDOM(content).window
  return doc.querySelector('section[data-output-path]')
}

module.exports = function(eleventyConfig, collections)  {
  eleventyConfig.addTransform('pdf', function (content) {
    const section = getPageSection(content)

    if (!section) return

    const sectionOutputPath = section.getAttribute('data-output-path')
    const pdfIndex = collections.pdf.findIndex(({ outputPath }) => {
      return sectionOutputPath === outputPath
    })

    if (pdfIndex !== -1) {
      collections.pdf[pdfIndex].sectionContent = section
    }

    if (!collections.pdf.every(({ sectionContent }) => !!sectionContent)) return

    writePDF(collections.pdf)

    /**
     * Skip building pages that aren't part of the html build
     */
    const htmlPaths = collections.html.map(({ outputPath }) => outputPath)
    return htmlPaths.includes(this.outputPath) ? content : undefined
  })
}
