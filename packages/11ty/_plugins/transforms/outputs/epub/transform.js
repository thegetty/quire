const filterOutputs = require('../filter.js')
const getIIIFConfig = require('../../../figures/iiif/config')
const jsdom = require('jsdom')
const layout = require('./layout')
const path = require('path')
const write = require('./write')

const { JSDOM } = jsdom

/**
 * Content transforms for EPUB output
 */
module.exports = function(eleventyConfig, collections, content) {
  const { output: iiifOutputDir } = getIIIFConfig(eleventyConfig).dirs
  const slugify = eleventyConfig.getFilter('slugify')
  const { imageDir } = eleventyConfig.globalData.config.params
  const { language } = eleventyConfig.globalData.publication

  /**
   * Transform image asset paths to be relative to epub directory
   *
   * @param      {HTMLElement}  element
   */
  const transformImagePaths = (element) => {
    const nodes = element.querySelectorAll('img')
    nodes.forEach((img) => {
      const url = img.getAttribute('src')
      if (!url) return
      const replace = `^\/(${iiifOutputDir}|${imageDir})`
      const regex = new RegExp(replace, 'g')
      img.setAttribute('src', url.replace(regex, '../$1'))
    })
    return element
  }

  /**
   * Remove pages excluded from this output type
   */
  const epubPages = collections.epub.map(({ outputPath }) => outputPath)
  const { ext } = path.parse(this.outputPath)
  const index = epubPages.findIndex((path) => path == this.outputPath)
  let epubContent =  index !== -1 ? content : undefined

  if (epubContent && ext === '.html') {
    const { document } = new JSDOM(epubContent).window
    const mainElement = document.querySelector('main[data-output-path]')
    const title = document.querySelector('title').innerHTML
    const body = document.createElement('body')
    body.innerHTML = mainElement.innerHTML
    body.setAttribute('id', mainElement.getAttribute('id'))

    /**
     * Remove elements excluded from this output type
     */
    filterOutputs(body, 'epub')
    transformImagePaths(body)

    const name = slugify(this.url) || path.parse(this.inputPath).name
    const targetLength = collections.epub.length.toString().length
    const sequence = index.toString().padStart(targetLength, 0)
    epubContent = layout({ body: body.outerHTML, language, title })
    const filename = `${sequence}_${name}.xhtml`
    write(filename, epubContent)
  }

  /**
   * Return unmodified content
   */
  return content
}
