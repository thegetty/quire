import { JSDOM } from 'jsdom'
import { html } from '#lib/common-tags/index.js'
import fs from 'fs-extra'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

/**
 * Iterate over output files and render with a `data` attribute
 * that allows tranforms to filter elements from output formats.
 */
export default async function (eleventyConfig, dir, params, page) {
  const fileNames = ['epub', 'html', 'pdf', 'print']

  const filePaths = fileNames.flatMap((output) => {
    const filePath = path.join(dir, `${output}.js`)
    return (fs.existsSync(filePath)) ? filePath : []
  })

  const content = await Promise.all(filePaths.flatMap(async (filePath, index) => {
    const { default: init } = await import(pathToFileURL(filePath))

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
