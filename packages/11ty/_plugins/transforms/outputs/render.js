const { html } = require('~lib/common-tags')
const fs = require('fs-extra')
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const path = require('path')

/**
 * Render all shortcode outputs
 */
module.exports = async function (eleventyConfig, dir, params) {
  const fileNames = ['epub', 'html', 'pdf', 'print']

  const filePaths = fileNames.flatMap((output) => {
    const filePath = path.join(dir, output)
    return (!fs.existsSync(`${filePath}.js`))
      ? []
      : filePath
  })

  const renderFns = await Promise.all(
    filePaths.map((filePath) => {
      const init = require(filePath)
      return init(eleventyConfig)
    })
  )

  const content = renderFns.map((renderFn, index) => {
    const fragment = JSDOM.fragment(renderFn(params))
    for (child of fragment.children) {
      const fileName = path.parse(filePaths[index]).name
      const output = fileName === 'print'
        ? 'epub,pdf'
        : fileName
      child.setAttribute('data-outputs-include', output)
    }
    return fragment.firstChild.outerHTML
  })
  return html`${content}`
}
