const path = require('path')

module.exports = (eleventyConfig) => {
  const root = eleventyConfig.dir.input
  return {
    input: path.join(root, '_assets', 'images', 'figures', 'iiif'),
    output: path.join('_assets', 'images', '_iiif'),
    root
  }
}
