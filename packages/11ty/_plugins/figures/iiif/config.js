const path = require('path')

module.exports = (eleventyConfig) => {
  const { baseURL } = eleventyConfig.globalData.config
  const { port } = eleventyConfig.serverOptions
  const iiifConfig = {
    baseURL: process.env.ELEVENTY_ENV === 'production' ? baseURL : `http://localhost:${port}`,
    dirs: {
      /**
       * The name of the directory for image tiles and info.json
       * @type {String}
       */
      imageService: 'tiles',
      /**
       * Image file directory relative to `inputRoot`
       */
      input: path.join('_assets', 'images'),
      /**
       * Image file root directory
       */
      inputRoot: eleventyConfig.dir.input,
      /**
       * Output directory
       * @type {String}
       */
      output: 'iiif',
      outputRoot: 'public'
    },
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
     * Generated manifest locale
     * @type {String}
     */ 
    locale: 'en',
    /**
     * Generated manifest file name
     * @type {String}
     */
    manifestFilename: 'manifest.json',
    tileSize: 256,
    /**
     * Transformations to apply to each image
     * Each item is output as a separate file
     *
     * @type {Array<Object>}
     * @property {String} name The file output name
     * @property {Object} resize Resize options for `sharp.resize()`
     * @see {@link https://sharp.pixelplumbing.com/api-resize}
     */
    transformations: [
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
    ]
  }
  eleventyConfig.addGlobalData('iiifConfig', iiifConfig)
}
