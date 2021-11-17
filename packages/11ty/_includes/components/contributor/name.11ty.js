module.exports = function (eleventyConfig, data, contributor) {
  const { first_name, full_name, last_name } = contributor
  return full_name ? full_name : [first_name, last_name].join(' ')
}