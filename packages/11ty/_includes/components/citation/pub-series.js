module.exports = function (eleventyConfig) {
  const {
    number_in_series: numberInSeries,
    series
  } = eleventyConfig.globalData.publication;

  return function (params) {
    const seriesStartsWithNumber =
      numberInSeries && numberInSeries.charAt(0).match(/\d/);
    const separator = seriesStartsWithNumber ? ' ' : ', ';

    return numberInSeries ? [series, numberInSeries].join(separator) : series;
  };
};
