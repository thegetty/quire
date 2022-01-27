/**
 * @param  {Object} context
 */
module.exports = function({ globalData }) {
  const { publication } = globalData
  const publishers = publication.publisher

  return publishers
    .map(({ name }) => name)
    .join(', ')
}
