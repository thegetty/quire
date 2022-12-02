/**
 * markdown-it default options
 * @see {@link https://markdown-it.github.io/markdown-it/#MarkdownIt.new}
 */
module.exports = {
  /**
   * Set to `true` to convert '\n' in paragraphs into <br> tags.
   */
  breaks: true,
  /**
   * Highlighter function
   * Returns escaped HTML or '' if the source string is not changed and should be escaped externally.
   * If the result starts with a <pre> tag the internal wrapper is skipped.
   * @example (string, language) => ''
   */
  highlight: null,
  /**
   * Set to `true` to enable HTML tags in source.
   */
  html: true,
  /**
   * CSS language prefix for fenced blocks; useful for external highlighters.
   */
  langPrefix: 'language-',
  /**
   * Autoconvert URL-like text to links
   */
  linkify: true,
  /**
   * Double + single quotes replacement pairs, when typographer enabled,
   * and smartquotes on. Could be either a String or an Array.
   * For example, you can use '«»„“' for Russian, '„“‚‘' for German,
   * and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
   */
  quotes: '“”‘’',
  /**
   * Enable some language-neutral replacement + quotes beautification
   * @see {@link https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.js}
   */
  typographer: true,
  /**
   * Use '/' to close single tags, for example <br />
   * This is only for full CommonMark compatibility.
   */
  xhtmlOut: false,
}
