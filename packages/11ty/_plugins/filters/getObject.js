const chalkFactory = require('~lib/chalk')

const { warn } = chalkFactory('filters:getObject')

/**
 * Looks up a object in objects.yaml by id
 * @param  {Object} eleventyConfig
 * @param  {String} id             object id
 * @return {Object}                object
 */
module.exports = function(eleventyConfig, id) {
  const { objects } = eleventyConfig.globalData
  const object = objects.object_list.find((item) => item.id === id)
  if (!object) {
    warn(`the id '${id}' was not found in 'objects.yaml'`)
    return ''
  }
  return object
}
