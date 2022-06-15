const applyTransforms = require('../transforms')
const filters = require('./filters')
const sortCollection = require('./sort')

/**
 * Add Collections and Apply Transforms
 * 
 * Nota bene: The Eleventy API does not make collections data accessible
 * from the plugin context. Adding `collections` and `transforms` sequentially
 * in the same file allows access to `collections` data from `transforms`
 *
 * @param  {Object} eleventyConfig
 * @param  {Object} options
 */
module.exports = function (eleventyConfig, options = {}) {
  /**
   * Collections
   */
  const collections = {}
  Object.keys(filters).forEach((name) => {
    eleventyConfig.addCollection(name, function (collectionApi) {
      collections[name] = collectionApi
        .getAll()
        .filter(filters[name])
        .sort(sortCollection)
      return collections[name]
    })
  })
  
  /**
   * Transforms
   */
  applyTransforms(eleventyConfig, collections)
}
