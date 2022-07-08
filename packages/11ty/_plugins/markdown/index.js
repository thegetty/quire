const MarkdownIt = require('markdown-it')
const anchorsPlugin = require('markdown-it-anchor')
const attributesPlugin = require('markdown-it-attrs')
const bracketedSpansPlugin = require('markdown-it-bracketed-spans')
const defaults = require('./defaults')
const deflistPlugin = require('markdown-it-deflist')
const footnotePlugin = require('markdown-it-footnote')
const removeMarkdown = require('remove-markdown')

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
  /**
   * @see https://github.com/valeriangalliat/markdown-it-anchor#usage
   */
  const anchorOptions = {}

  /**
   * @see https://github.com/arve0/markdown-it-attrs#usage
   */
  const attributesOptions = {
    allowedAttributes: ['class', 'id'],
    leftDelimiter: '{',
    rightDelimiter: '}'
  }

  const markdownLibrary = MarkdownIt(Object.assign(defaults, options))
    .use(anchorsPlugin, anchorOptions)
    .use(attributesPlugin, attributesOptions)
    .use(bracketedSpansPlugin)
    .use(deflistPlugin)
    .use(footnotePlugin)

  /**
   * Configure automatic link detection
   * @see https://github.com/markdown-it/linkify-it#api
   */
  markdownLibrary.linkify.set({ fuzzyLink: false })

  /**
   * Configure renderer to exclude brakcets from footnotes
   */
  markdownLibrary.renderer.rules.footnote_caption = (tokens, idx) => {
    let n = Number(tokens[idx].meta.id + 1).toString()
    if (tokens[idx].meta.subId > 0) {
      n += ':' + tokens[idx].meta.subId
    }
    return n
  }

  eleventyConfig.setLibrary('md', markdownLibrary)

  /**
   * Add a universal template filter to render markdown strings as HTML
   * @see https://github.com/markdown-it/markdown-it#simple
   */
  eleventyConfig.addFilter('markdownify', (content) => {
    if (!content) return ''

    return !content.match(/\n/)
      ? markdownLibrary.renderInline(content)
      : markdownLibrary.render(content)
  })

  /**
   * Add a universal template filter to remove markdown from a string
   * @see
   */
  eleventyConfig.addFilter('removeMarkdown', (content) => {
    return content ? removeMarkdown(content) : ''
  })
}
