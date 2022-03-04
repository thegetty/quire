module.exports = function(eleventyConfig, globalData) {
  return function (params) {
    const { date } = params
    return new Date(date).getFullYear()
  }
}
