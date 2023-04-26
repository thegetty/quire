const { html } = require('~lib/common-tags')
const fs = require('fs-extra')
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const path = require('path')

/**
 * Iterate over output files and render with a `data` attribute
 * that allows tranforms to filter elements from output formats.
 */
module.exports = async function (eleventyConfig, dir, params, page) {
  const fileNames = ['epub', 'html', 'pdf', 'print']

  const filePaths = fileNames.flatMap((output) => {
    const filePath = path.join(dir, output)
    return (!fs.existsSync(`${filePath}.js`)) ? [] : filePath
  })

  const content = await Promise.all(filePaths.flatMap(async (filePath, index) => {
    const init = require(filePath)
    const renderFn = init(eleventyConfig, { page })
    const component = await renderFn(params)
    const fragment = JSDOM.fragment(component)
    return [...fragment.children].map((child) => {
      const fileName = path.parse(filePaths[index]).name
      const outputs = fileName === 'print' ? 'epub,pdf' : fileName
      child.setAttribute('data-outputs-include', outputs)
      return child.outerHTML
    }).join('\n')
  }))

  return html`${content}`
}
