module.exports = function(eleventyConfig, { publication }) {
  const publishers = publication.publisher

  return publishers
    .map(({ location, name }) => [location, name].join(": "))
    .join('; ')
}