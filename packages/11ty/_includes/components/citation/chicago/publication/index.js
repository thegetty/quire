/**
 * @param  {Object} eleventyConfig
 * @param  {Object} params
 */
module.exports = function (eleventyConfig) {
  const citePublicationSeries = eleventyConfig.getFilter('citePublicationSeries');
  const publicationContributors = eleventyConfig.getFilter('chicagoPublicationContributors');
  const publishers = eleventyConfig.getFilter('chicagoPublishers');
  const pubYear = eleventyConfig.getFilter('pubYear');
  const siteTitle = eleventyConfig.getFilter('siteTitle');
  const {
    contributor: contributors,
    identifier,
    pub_date: pubDate,
    publisher,
  } = eleventyConfig.globalData.publication;

  return function (params) {
    let citation;

    if (contributors) {
      citation = publicationContributors();
    }

    const titleElement = `<em>${siteTitle()}</em>`
    citation = citation
      ? [citation, titleElement].join('. ')
      : titleElement;

    if (citePublicationSeries()) citation = [citation, citePublicationSeries()].join('. ');

    if (publisher.length) {
      citation = [citation, publishers()].join('. ');
    }

    if (pubDate) {
      citation = [citation, pubYear()].join(', ');
    }

    citation += '.';

    if (identifier.url) {
      citation = [
        citation,
        `<span class="url-string">${identifier.url}</span>.`
      ].join(' ');
    }

    return citation;
  };
};
