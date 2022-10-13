const transform = require('./transform.js')
const publicationData = require('./publication-data.js')
const write = require('./write.js')

module.exports = (eleventyConfig, collections) => {
  /**
   * Write sequenced files to `epub` directory during transform
   */
  eleventyConfig.addTransform('epub', function (content) {
    return transform.call(this, eleventyConfig, collections, content)
  })
  /**
   * Write publication JSON
   */
  eleventyConfig.on('eleventy.after', () => {
    const publicationJSON = JSON.stringify(publicationData(eleventyConfig))
    write('publication.json', publicationJSON)
  })
}
