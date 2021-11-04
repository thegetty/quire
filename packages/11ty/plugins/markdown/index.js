const markdownIt = require('markdown-it')
// const markdownItAnchor = require('markdown-it-anchor')
const markdownItFootnote = require('markdown-it-footnote')

/**
 * An Eleventy plugin to configure the markdown library
 * and add a `markdownify` universal template filter.
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  [options]       markdown-it options
 */
module.exports = function(eleventyConfig, options) {
  const defaultOptions = {
    breaks: true,
    html: true,
    linkify: true,
    typographer: true,
  }

  const markdownLibrary = markdownIt(Object.assign(defaultOptions, options))
    // .use(markdownItAnchor, {
    //   permalink: true,
    //   permalinkClass: 'direct-link',
    //   permalinkSymbol: '#',
    // })
    .use(markdownItFootnote)

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
