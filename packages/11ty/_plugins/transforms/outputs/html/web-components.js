const fs = require('fs-extra')
const jsdom = require('jsdom')
const path = require('path')

/**
 * An Eleventy transform function to register web component modules in <head>
 *
 * @param      {String}  content
 * @return     {String}  transformed content
 */
module.exports = function (dom) {
  const webComponentPath = path.resolve('_includes', 'web-components')

  const webComponentModulePaths = fs
    .readdirSync(webComponentPath, { withFileTypes: true })
    .reduce((modulePaths, filePath) => {
      if (filePath.isDirectory()) modulePaths.push(
        path.join('_assets', 'javascript', filePath.name, 'index.js'),
      )

      return modulePaths
    }, [])

  const { document } = dom.window
  const { head } = document

  // Register web components in the current file's <head>
  webComponentModulePaths.forEach((modulePath) => {
    const scriptTag = document.createElement('script')
    scriptTag.setAttribute('type', 'module')
    scriptTag.setAttribute('src', `/${modulePath}`)
    head.appendChild(scriptTag)
  })

  return dom.serialize()
}
