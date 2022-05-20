/**
 * Looks up a contributor in publication.yaml[contributor] by id
 * @param  {Object} eleventyConfig
 * @param  {Object} contributor
 * @return {Object}                contributor
 */
module.exports = function(eleventyConfig, item) {
  // Return object if contains more than `id` property
  if (Object.keys(item).length > 1) return item
  // Look up contributor by id in `publication` global data
  const { publication } = eleventyConfig.globalData
  const contributor = publication.contributor.find((contributor) => contributor.id === item.id)
  if (!contributor) {
    console.warn(`Error: the id '${id}' was not found under contributor in 'publication.yaml'`)
    return ''
  }
  return contributor
}
