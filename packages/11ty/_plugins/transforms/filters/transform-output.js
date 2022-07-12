const jsdom = require('jsdom')
const { JSDOM } = jsdom

/**
 * Conditionally render elements for different outputs (epub, html, pdf)
 *
 * @param      {HTMLElement}  element
 * @param      {String}  output 'pdf', 'epub', 'html'
 * @param      {String}  path
 */
module.exports = (eleventyConfig, { element, output, path }) => {
  const nodes = element.querySelectorAll('[data-transform-output]')
  nodes.forEach((node) => {
    const id = node.getAttribute('data-transform-output')
    delete node.dataset.transformOutput

    if (!eleventyConfig.transforms[path]) return

    const content = eleventyConfig.transforms[path][id][output]
    const newNode = JSDOM.fragment(content)
    node.parentNode.replaceChild(newNode, node)
  })
  return element
}
