/**
 * @param  {Object} context
 */
module.exports = function(eleventyConfig, data) {
  const { publication } = data
  const publishers = publication.publisher

  return publishers
    .map(({ name }) => name)
    .join(', ')
}
