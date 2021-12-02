/**
 * Looks up a object in objects.yaml by id
 * @param  {Object} eleventyConfig
 * @param  {Object} globalData
 * @param  {String} id             object id
 * @return {Object}                object
 */
module.exports = function(eleventyConfig, { objects }, id) {
  const object = objects.object_list.find((item) => item.id === id)
  if (!object) {
    console.warn(`Error: the id '${id}' was not found in 'objects.yaml'`)
    return ''
  }

  return object
}
