/**
 * @param  {Object} context
 */
module.exports = function(eleventyConfig, data) {
  const { publication } = data
  const publishers = publication.publisher

  return publishers
    .map(({ location, name }) => [location, name].join(": "))
    .join('; ')
}
