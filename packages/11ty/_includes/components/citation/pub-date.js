module.exports = function(eleventyConfig, data) {
  const { publication } = data
  return new Date(publication.pub_date).getFullYear()
}
