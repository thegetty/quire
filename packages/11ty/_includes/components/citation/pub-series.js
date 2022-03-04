module.exports = function(eleventyConfig, globalData) {
  return function (params) {
    const { publication } = params
    const { series, number_in_series } = publication

    const seriesStartsWithNumber = number_in_series && number_in_series.charAt(0).match(/\d/)
    const separator = seriesStartsWithNumber ? ' ' : ', '

    return number_in_series
      ? [series, number_in_series].join(separator)
      : series
  }
}
