const fs = require('fs-extra')
const jsdom = require('jsdom')
const path = require('path')

/**
 * An Eleventy transform function to register web component modules in <head>
 *
 * @param      {String}  content
 * @return     {String}  transformed content
 */
module.exports = function (content) {
  const webComponentPath = path.resolve('web-components')

  const webComponentModules = fs
    .readdirSync(webComponentPath, { withFileTypes: true })
    .reduce((modules, filePath) => {
      if (filePath.isDirectory()) modules.push({
        src: path.join('_assets', 'javascript', filePath.name, 'index.js'),
        tagName: `q-${filePath.name}`
      });

      return modules
    }, [])

  const { JSDOM } = jsdom
  const dom = new JSDOM(content)
  const { document } = dom.window
  const { head } = document

  // Register web components in the current file's <head>
  webComponentModules.forEach(({ src, tagName }) => {
    const scriptTag = document.createElement('script')
    scriptTag.setAttribute('type', 'module')
    scriptTag.setAttribute('src', `/${src}`)
    head.appendChild(scriptTag)
  })

  return dom.serialize()
}
