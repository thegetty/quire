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
 * @return {Object} collections
 */
module.exports = function (eleventyConfig, options = {}) {
  let collections = {}

  /**
   * Add sorted "all" collection
   */
  eleventyConfig.addCollection('allSorted', function (collectionApi) {
    return collectionApi.getAll().sort(sortCollection)
  })

  /**
   * Add eleventy-generated collections to collections object
   */
  eleventyConfig.addCollection('temp', function (collectionApi) {
    const eleventyCollections = collectionApi.getAll()[0].data.collections
    Object.assign(collections, eleventyCollections)
    return []
  })

  /**
   * Add custom collections
   */
  for (const name in filters) {
    eleventyConfig.addCollection(name, function (collectionApi) {
      collections[name] = collectionApi
        .getAll()
        .filter(filters[name])
        .sort(sortCollection)
      return collections[name]
    })
  }
  return collections
}
