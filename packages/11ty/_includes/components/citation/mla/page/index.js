const { oneLine } = require('common-tags');
/**
 * @param  {Object} eleventyConfig
 * @param  {Object} params
 * @property  {Object} page
 * @property  {Object} publication
 */
module.exports = function (eleventyConfig) {
  const citeContributors = eleventyConfig.getFilter('citeContributors');
  const pageTitle = eleventyConfig.getFilter('pageTitle');
  const publicationContributors = eleventyConfig.getFilter('MLAPagePublicationContributors');
  const publishers = eleventyConfig.getFilter('MLAPublishers');
  const pubYear = eleventyConfig.getFilter('pubYear');
  const siteTitle = eleventyConfig.getFilter('siteTitle');
  const { publication } = eleventyConfig.globalData;
  const { identifier, pub_date: pubDate } = publication;

  return function (params) {
    const { page } = params;
    const { contributor: pageContributors, label, subtitle, title } = page.data;

    let citation;

    if (pageContributors) {
      citation = citeContributors({
        contributors: pageContributors,
        max: 2,
        reverseFirst: true,
      });
    }

    let pageTitleString;
    if (title) {
      pageTitleString = `“${pageTitle({ subtitle, title })}.”`;
    } else if (label) {
      pageTitleString = `“${label}.”`;
    } else {
      pageTitleString = 'Untitled.';
    }

    citation = citation ? [citation, pageTitleString].join('. ') : pageTitleString;

    citation = [citation, `<em>${siteTitle()}</em>`].join(' ');

    if (publication.contributor)
      citation = [citation, publicationContributors()].join(
        ', '
      );

    citation = [citation, publishers()].join('. ');

    if (pubDate) citation = [citation, pubYear({ date: pubDate })].join(', ');

    const url = page.url || identifier.url;
    if (url)
      citation = [citation, `<span class='url-string'>${url}</span>`].join('. ');

    citation = [citation, `Accessed <span class='cite-current-date'>DD Mon. YYYY</span>.`].join('. ');

    return oneLine`${citation}`;
  };
};
