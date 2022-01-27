/**
 * @param  {Object} context
 */
module.exports = function({ globalData }) {
  const { publication } = globalData
  const publishers = publication.publisher

  return publishers
    .map(({ location, name }) => [location, name].join(": "))
    .join('; ')
}
