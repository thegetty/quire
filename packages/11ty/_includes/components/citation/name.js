/**
 * Adapts Quire person data to CSL "name" variable
 */
module.exports = function(eleventyConfig) {
  return function (params) {
    const { first_name, full_name, last_name } = params
    const family = last_name || full_name.split(' ').pop()
    const given = first_name || full_name.split(' ')[0]
    return { family, given }
  }
}
