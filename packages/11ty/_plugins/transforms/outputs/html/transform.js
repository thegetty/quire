import { JSDOM } from 'jsdom'
import filterOutputs from '../filter.js'
import path from 'node:path'
import registerWebComponents from './web-components.js'

/**
 * Content transforms for html output
 */
export default function (eleventyConfig, collections, content) {
  const slugifyIds = eleventyConfig.getFilter('slugifyIds')
  /**
   * Remove pages excluded from this output type
   */
  const pages = collections.html.map(({ outputPath }) => outputPath)
  const { ext } = path.parse(this.outputPath)
  content = pages.includes(this.outputPath) ? content : undefined

  if (content && ext === '.html') {
    const dom = new JSDOM(content)
    /**
     * Remove elements excluded from this output type
     */
    filterOutputs(dom.window.document, 'html')
    /**
     * Add web component script tags to <head>
     */
    registerWebComponents(dom)
    slugifyIds(dom.window.document)
    content = dom.serialize()
  }

  return content
}
