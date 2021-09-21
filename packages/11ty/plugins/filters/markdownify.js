const MarkdownIt = require('markdown-it')
const markdown = new MarkdownIt()
/**
 * Parse markdown data
 *
 * @param      {String}  markdown content
 * @return     {String}  parsed markdown
 */
module.exports = (content) => {
  return markdown.renderInline(content)
}
