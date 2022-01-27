/**
 * Universal shortcode to wrap content in a styled HTML <div> element
 *
 * @param  {String}         content  content between shortcode tags
 * @param  {Array<String>}  classes  Style classes applied to the wrapping div
 *
 * @return     {boolean}  A styled HTML <div> element containing the content
 */
module.exports = (context, content, classes=[]) => {
  const { eleventyConfig } = context
  const markdownify = eleventyConfig.getFilter('markdownify')
  classes = [classes].flatMap((item) => item).join(' ')
  return `<div class="${classes}">${markdownify(content)}</div>`
}
