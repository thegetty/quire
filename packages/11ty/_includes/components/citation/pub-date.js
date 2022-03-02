module.exports = function(eleventyConfig, date) {
  return new Date(date).getFullYear()
}
