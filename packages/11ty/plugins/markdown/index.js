const anchors = require('markdown-it-anchor')
const footnotes = require('markdown-it-footnote')
const markdownIt = require('markdown-it')

/**
 * An Eleventy plugin to configure the markdown library
 * and add a `markdownify` universal template filter.
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  [options]       markdown-it options
 * @see https://github.com/markdown-it/markdown-it#init-with-presets-and-options
 * @property {boolean} [options.breaks] Convert '\n' in paragraphs into <br>
 * @property {boolean} [options.html]   Enable HTML tags in source
 * @property {boolean} [options.linkify] Autoconvert URL-like text to links
 * @property {boolean} [options.typographer] Enable some language-neutral replacement + quotes beautification
 */
module.exports = function(eleventyConfig, options) {
  const defaultOptions = {
    breaks: true,
    html: true,
    linkify: true,
    typographer: true,
  }

  /**
   * @see https://github.com/valeriangalliat/markdown-it-anchor#usage
   */
  const anchorOptions = {}

  const markdownLibrary = markdownIt(Object.assign(defaultOptions, options))
    .use(anchors, anchorOptions)
    .use(footnotes)

  /**
   * Configure renderer to exclude brakcets from footnotes
   */
  markdownLibrary.renderer.rules.footnote_caption = (tokens, idx) => {
    let n = Number(tokens[idx].meta.id + 1).toString()
    if (tokens[idx].meta.subId > 0) {
      n += ":" + tokens[idx].meta.subId
    }
    return n
  }

  eleventyConfig.setLibrary('md', markdownLibrary)


  const renderer = new MarkdownIt()

  eleventyConfig.addFilter('markdownify', (content) => {
    return renderer.renderInline(content)
  })
}
