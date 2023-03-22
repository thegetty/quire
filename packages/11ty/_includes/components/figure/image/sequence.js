const path = require('path')

module.exports = function(eleventyConfig) {
  const renderFile = eleventyConfig.getFilter('renderFile')
  const renderTemplate = eleventyConfig.getFilter('renderTemplate')
  const { assetDir } = eleventyConfig.globalData.config.figures
  return async function({ id, sequences }) {
    const { WebC } = await import('@11ty/webc')
    const page = new WebC()
    const fileName = 'image-sequence.webc'
    const filePath = path.join(eleventyConfig.dir.input, eleventyConfig.dir.includes, 'components', 'figure', 'image', fileName)
    const itemUris = sequences[0].items.map(({ uri }) => uri).join(',')
    page.setContent(`<image-sequence sequence-id="${id}" items="${itemUris}" webc:import="${filePath}"></image-sequence>`)
    const { html, css, js, components } = await page.compile()
    return html

    // using renderTemplate with markdown works
    // return await renderTemplate('# Heading', 'md')

    // using renderTemplate/renderFile with webc does not work
    // return await renderTemplate('<image-sequence></image-sequence>', 'webc')
    // return await renderFile(filePath)
  }
}
