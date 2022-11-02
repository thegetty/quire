module.exports = function (eleventyConfig) {
  const {
    seriesNumber,
    seriesTitle
  } = eleventyConfig.globalData.publication

  return function (params) {
    const seriesStartsWithNumber =
      seriesNumber && seriesNumber.toString().charAt(0).match(/\d/)
    const separator = seriesStartsWithNumber ? ' ' : ', '

    return seriesNumber ? [seriesTitle, seriesNumber].join(separator) : seriesTitle
  }
}
