const filters = require('./filters')
const sortCollection = require('./sort')
const applyTransforms = require('../transforms')

/**
 * Add custom collections and apply transforms
 * 
 * Nota bene: Adding the collections in the same file as the transforms allows
 * us to access to the collection data which otherwise is not available in a plugin
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
}
