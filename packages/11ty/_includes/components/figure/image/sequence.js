const path = require('path')

module.exports = function(eleventyConfig) {
  const renderWebcComponent = eleventyConfig.getFilter('renderWebcComponent')
  const { assetDir } = eleventyConfig.globalData.config.figures
  return async function({ id, sequences, startCanvasIndex }) {
    const itemUris = sequences[0].items.map(({ uri }) => uri).join(',')
    const fileName = 'image-sequence.webc'
    const includesDir = path.join(eleventyConfig.dir.input, eleventyConfig.dir.includes)
    const componentPathname = __dirname.split(includesDir)[1]
    const filePath = path.join(includesDir, componentPathname, fileName)
    // const filePath = path.join('_includes', 'components', 'figure', 'image', 'image-sequence.webc')
    return await renderWebcComponent(filePath, {
      'index': startCanvasIndex,
      'items': itemUris,
      'sequence-id': id
    })
  }
}
