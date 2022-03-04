/**
 * @param  {Object} context
 */
module.exports = function(eleventyConfig, globalData) {
  return function (params) {
    const { publication } = params
    const publishers = publication.publisher

    return publishers
      .map(({ location, name }) => [location, name].join(": "))
      .join('; ')
  }
}
