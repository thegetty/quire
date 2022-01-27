/**
 * @param  {Object} context
 * @param  {Object} contributor
 * @param  {Object} options
 *
 * @return {String} contributor display name
 */
module.exports = function (context, contributor, options={}) {
  const { first_name, full_name, last_name } = contributor
  const nameParts = [first_name, last_name].filter(item => item)
  let joinedName
  if (options.reverse) {
    joinedName = nameParts.reverse().join(', ')
  } else {
    joinedName = nameParts.join(' ')
  }
  return full_name ? full_name : joinedName
}
