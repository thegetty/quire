const path = require('path')

/**
 * Shortcode component to render referenced template file content
 * @see https://www.11ty.dev/docs/plugins/render/#renderfile
 *
 * @param  {EleventyConfig}  eleventyConfig  Eleventy configuration
 */
module.exports = function (eleventyConfig) {
  const renderFile = eleventyConfig.getFilter('renderFile')
  const { assetDir } = eleventyConfig.globalData.config.figures

  /**
   * Render template file content referenced by a `figure.src` property
   *
   * @param  {Object}  figure  Figure entry data from `figures.yaml`
   * @param  {String}  figure.src  File path relative to the project root
   * @param  {Object}  data  Additional data passed to the template file
   * @param  {String}  extension  Override the target file syntax
   *
   * @return  {String}  Text content of the referenced template file
   */
  return async function ({ src }) {
    const filePath = path.join(eleventyConfig.dir.input, assetDir, src)
    return await renderFile(filePath)
  }
}
