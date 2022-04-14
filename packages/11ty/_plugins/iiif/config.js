const path = require('path')

module.exports = (eleventyConfig) => {
  const root = eleventyConfig.dir.input
  return {
    imageVariations: [
      {
        name: 'thumb',
        width: 50
      },
      {
        name: 'default',
        width: 800
      }
    ],
    input: path.join(root, '_assets', 'images', 'figures', 'iiif'),
    manifestFilename: 'manifest.json',
    output: path.join('_assets', 'images', '_iiif'),
    root,
    supportedImageExtensions: [
      '.jp2',
      '.jpg',
      '.jpeg',
      '.png',
      '.svg',
      '.tif',
      '.tiff'
    ]
  }
}
