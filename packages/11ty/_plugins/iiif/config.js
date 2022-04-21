const path = require('path')

module.exports = (eleventyConfig) => {
  const root = eleventyConfig.dir.input
  return {
    /**
     * Transformations to apply to each image
     * Each item is output as a separate file
     *
     * @type {Array<Object>}
     * @property {String} name The file output name
     * @property {Object} resize Resize options for `sharp.resize()`
     * @see {@link https://sharp.pixelplumbing.com/api-resize}
     */
    imageTransformations: [
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
    /**
     * Input directory
     * @type {String}
     */
    input: path.join(root, '_assets', 'images', 'figures', 'iiif'),
    /**
     * Generated manifest locale
     * @type {String}
     */
    locale: 'en',
    /**
     * Generated manifest file name
     * @type {String}
     */
    manifestFilename: 'manifest.json',
    /**
     * Output directory
     * @type {String}
     */
    output: path.join('_assets', 'images', '_iiif'),
    /**
     * The eleventy project directory
     */
    root,
    /**
     * Image extensions that can be processed
     * @type {Array}
     */
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
