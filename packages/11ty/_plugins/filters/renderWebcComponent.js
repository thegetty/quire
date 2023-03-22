const path = require('path')

module.exports = async (filePath, attrs) => {
  const { WebC } = await import('@11ty/webc')
  const page = new WebC()
  const { name: componentName } = path.parse(filePath)
  const attributes = Object.keys(attrs).reduce((acc, key) => {
    return acc += `${key}="${attrs[key]}"`
  }, '')
  page.setContent(`<${componentName} ${attributes} webc:import="${filePath}"></${componentName}>`)
  const { html, css, js, components } = await page.compile()
  return html
}
