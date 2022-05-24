module.exports = function(eleventyConfig) {
  return function (params) {
    const { date } = params
    return new Date(date).getFullYear()
  }
}
