const path = require('path')

module.exports = (eleventyConfig) => {
  const root = eleventyConfig.dir.input
  return {
    imageVariations: [
      {
        name: 'thumb',
        resize: {
          width: 50
        }
      },
      {
        name: 'default'
      }
    ],
    input: path.join(root, '_assets', 'images', 'figures', 'iiif'),
    locale: 'en',
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
