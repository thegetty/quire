module.exports = function (eleventyConfig, data, contributor, options={}) {
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
