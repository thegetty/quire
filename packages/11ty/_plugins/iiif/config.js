const path = require('path')

module.exports = (eleventyConfig) => {
  const { config, env } = eleventyConfig.globalData
  return {
    baseURL: config.baseURL || env.URL,
    /**
     * Input and output of processable image formats
     * @type {Array<Object>}
     */
    formats: [
     {
      input: ['.png', '.svg'],
      output: '.png'
     },
     {
      input: ['.jp2', '.jpg', '.jpeg', '.tif', '.tiff'],
      output: '.jpg'
     }
    ],
    imageDir: config.params.imageDir,
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
        name: 'thumbnail',
        resize: {
          width: 50
        }
      },
      /**
       * Transformation applied to imageservice images for use in PDF and EPUB
       */
      {
        name: 'print-image',
        resize: {
          width: 800
        }
      }
    ],
    /**
     * The name of the directory for image tiles and info.json
     * @type {String}
     */
    imageServiceDirectory: 'tiles',
    inputDir: path.join('content', '_assets', 'images'),
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
    outputDir: 'iiif',
    outputRoot: 'public',
    tileSize: 256
  }
}
