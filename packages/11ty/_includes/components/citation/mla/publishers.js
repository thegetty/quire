module.exports = function(eleventyConfig, { publication }) {
  const publishers = publication.publisher

  return publishers
    .map(({ name }) => name)
    .join(', ')
}