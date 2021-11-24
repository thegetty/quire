module.exports = function(eleventyConfig, { publication }) {
  return new Date(publication.pub_date).getFullYear()
}
