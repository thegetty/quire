import epub from './epub/index.js'
import html from './html/transform.js'
import pdf from './pdf/transform.js'
import renderOutputs from './render.js'

/**
 * Eleventy plugin to transform content for output as epub, html, pdf
 *
 * @param      {Object}  eleventyConfig  Eleventy configuration
 * @param      {Object}  collections  Eleventy collections
 */
export default function (eleventyConfig, { collections }) {
  eleventyConfig.addJavaScriptFunction('renderOutputs', function (...args) {
    return renderOutputs(eleventyConfig, ...args)
  })
  /**
   * Nota bene:
   * - Call transform with `this` context to ensure we have `this.outputPath`
   * - Order is important. The `html` transform must run last.
   */
  eleventyConfig.addPlugin(epub, collections)

  eleventyConfig.addTransform('pdf', function (content) {
    return pdf.call(this, eleventyConfig, collections, content)
  })
  eleventyConfig.addTransform('html', function (content) {
    return html.call(this, eleventyConfig, collections, content)
  })
}
