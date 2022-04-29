/**
 * Looks up a contributor in publication.yaml[contributor] by id
 * @param  {Object} eleventyConfig
 * @param  {String} id             contributor id
 * @return {Object}                contributor
 */
module.exports = function(eleventyConfig, id) {
  const { publication } = eleventyConfig.globalData
  const contributor = publication.contributor.find((item) => item.id === id)
  if (!contributor) {
    console.warn(`Error: the id '${id}' was not found under contributor in 'publication.yaml'`)
    return ''
  }
  return contributor
}
