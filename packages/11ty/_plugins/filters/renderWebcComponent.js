const path = require('path')

/**
 * Renders a WebC Component
 * this is a rudimentary version of what `eleventy-plugin-webc` should be doing for us, but which throws errors due to missing eleventy context in our shortcodes.
 *
 * @param  {String} filePath  File path to `.webc` file, relative to project root
 * @param  {Object} attrs     Key-value pairs of component attributes
 * @return {String} html      Webc component markup
 */
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
