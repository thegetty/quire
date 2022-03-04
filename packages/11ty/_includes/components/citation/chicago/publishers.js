/**
 * @param  {Object} context
 */
module.exports = function(eleventyConfig, globalData) {
  const { publication } = globalData

  return function (params) {
    const publishers = publication.publisher

    return publishers
      .map(({ location, name }) => [location, name].join(": "))
      .join('; ')
  }
}
