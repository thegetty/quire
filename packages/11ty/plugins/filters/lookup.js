/**
 * Looks up a global data entry by it's identifier
 *
 * @param  {Object} context
 * @param  {String} type         A global data type
 * @param  {String} id           identifier
 * @return {Object|String}     The data entry matching the identifier
 */
module.exports = function(context, type, id) {
  const { eleventyConfig, globalData, page } = context

  // const recurse = (object, path) => {
  //   const parts = path.split('.')
  //   if (parts.length === 1) return object[parts[0]]
  //   return recurse(object[parts[0]], parts.slice(1).join('.'))
  // }

  // const data = recurse(globalData, path)

  const data = globalData[type]

  if (!data) {
    console.warn(`${page.inputPath} Unkown global data type '${type}'`)
    return ''
  }

  const entries = data[`${type}_list`] || data
  const entry = data.find((item) => item.id === id)

  if (!entry) {
    console.warn(`${page.inputPath} Error: '${type}.${id}' was not found in '${type}.yaml`)
    return ''
  }

  return entry
}
