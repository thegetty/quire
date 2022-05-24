/**
 * @param  {Object} context
 */
module.exports = function(eleventyConfig) {
  const { publisher: publishers } = eleventyConfig.globalData.publication

  return function (params) {
    if (!publishers || !publishers.length) return

    return publishers
      .map(({ name }) => name)
      .join(', ')
  }
}
