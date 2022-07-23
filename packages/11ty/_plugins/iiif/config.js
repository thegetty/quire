const path = require('path')

module.exports = (eleventyConfig) => {
  return {
    baseURL: eleventyConfig.globalData.config.baseURL || eleventyConfig.globalData.env.URL,
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
      }
    ],
    /**
     * The name of the directory for image tiles and info.json
     * @type {String}
     */
    imageServiceDirectory: 'tiles',
    /**
     * Generated manifest locale
     * @type {String}
     */
    inputDir: path.join('content', '_assets', 'images'),
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
