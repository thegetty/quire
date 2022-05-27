module.exports = function(eleventyConfig) {
  const pubDate = eleventyConfig.globalData.publication.pub_date
  return function (params) {
    return new Date(pubDate).getFullYear()
  }
}
