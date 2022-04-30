/**
 * @param  {Object} context
 */
module.exports = function(eleventyConfig) {
  const { publication } = eleventyConfig.globalData

  return function (params) {
    const publishers = publication.publisher

    return publishers
      .map(({ location, name }) => [location, name].join(": "))
      .join('; ')
  }
}
