const MarkdownIt = require('markdown-it')
const anchorsPlugin = require('markdown-it-anchor')
const attributesPlugin = require('markdown-it-attrs')
const bracketedSpansPlugin = require('markdown-it-bracketed-spans')
const defaults = require('./defaults')
const deflistPlugin = require('markdown-it-deflist')
const footnotePlugin = require('markdown-it-footnote')
const { footnoteRef, footnoteTail } = require('./footnotes')
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
   * To prevent duplicate element IDs from slugified headings, we are only generating anchor links for level 1 headings
   */
  const anchorOptions = {
    level: [1]
  }

  /**
   * @see https://github.com/arve0/markdown-it-attrs#usage
   */
  const attributesOptions = {
    allowedAttributes: ['class', 'id', 'target'],
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
   * Set recognition options for links without a schema
   * @see https://github.com/markdown-it/linkify-it#api
   */
  markdownLibrary.linkify.set({ fuzzyLink: false })

  /**
   * Remember old renderer, if overridden, or proxy to default renderer
   */
  const defaultRender = markdownLibrary.renderer.rules.link_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options)
    }

  /**
   * Render external links so that they open in a new tab
   */
  markdownLibrary.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const href = tokens[idx].attrGet('href')
    if (href.startsWith('http')) {
      tokens[idx].attrSet('target', '_blank')
    }
    return defaultRender(tokens, idx, options, env, self)
  }

  /**
   * Override default renderer to remove <hr class="footnotes-sep"/> element
   */
  markdownLibrary.renderer.rules.footnote_block_open = () => {
    return '<section class="footnotes">\n<ol class="footnotes-list">\n'
  }

  /**
   * Override default renderer to remove brackets from footnotes
   */
  markdownLibrary.renderer.rules.footnote_caption = (tokens, idx) => {
    let n = Number(tokens[idx].meta.id + 1).toString()
    if (tokens[idx].meta.subId > 0) {
      n += ':' + tokens[idx].meta.subId
    }
    return n
  }

  /**
   * Override default renderer to add class to footnote ref anchor
   */
  markdownLibrary.renderer.rules.footnote_ref = (tokens, idx, options, env, slf) => {
    var id = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf)
    var caption = slf.rules.footnote_caption(tokens, idx, options, env, slf)
    var refid = id
  
    if (tokens[idx].meta.subId > 0) {
      refid += ':' + tokens[idx].meta.subId
    }
  
    return '<sup class="footnote-ref"><a href="#fn' + id + '" id="fnref' + refid + '" class="footnote-ref-anchor">' + caption + '</a></sup>';
  }

  /** 
   * Use custom footnote_ref and footnote_tail definitions
   */
  markdownLibrary.inline.ruler.after('footnote_inline', 'footnote_ref', footnoteRef)
  markdownLibrary.core.ruler.after('inline', 'footnote_tail', footnoteTail)

  eleventyConfig.setLibrary('md', markdownLibrary)

  /**
   * Add a universal template filter to render markdown strings as HTML
   * @see https://github.com/markdown-it/markdown-it#simple
   */
  eleventyConfig.addFilter('markdownify', (content, options = {}) => {
    if (!content) return ''

    return content.match(/\n/) || options.inline === false
      ? markdownLibrary.render(content)
      : markdownLibrary.renderInline(content) 
  })

  /**
   * Add a universal template filter to remove markdown from a string
   * @see
   */
  eleventyConfig.addFilter('removeMarkdown', (content) => {
    return content ? removeMarkdown(content) : ''
  })
}
