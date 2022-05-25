const { oneLine } = require('common-tags');
/**
 * @param  {Object} eleventyConfig
 * @param  {Object} params
 * @property  {Object} publication
 * @property  {Object} page
 */
module.exports = function (eleventyConfig) {
  const citeContributors = eleventyConfig.getFilter('citeContributors');
  const pageTitle = eleventyConfig.getFilter('pageTitle');
  const publicationContributors = eleventyConfig.getFilter('chicagoPagePublicationContributors');
  const publishers = eleventyConfig.getFilter('chicagoPublishers');
  const pubYear = eleventyConfig.getFilter('pubYear');
  const siteTitle = eleventyConfig.getFilter('siteTitle');
  const { publication } = eleventyConfig.globalData;
  const { pub_date: pubDate } = publication;

  return function (params) {
    const { page } = params;
    const { contributor: pageContributors, label, subtitle, title } = page.data;

    let citation;

    if (pageContributors) {
      citation = citeContributors({
        contributors: pageContributors,
        max: 3,
        reverseFirst: true
      });
    }

    let pageTitleString = title
      ? `${pageTitle({ subtitle, title })}.`
      : label || 'Untitled.';
    pageTitleString = `“${pageTitleString}”`

    citation = (citation) 
      ? [citation, pageTitleString].join('. ') 
      : pageTitleString

    citation = [citation, `In <em>${siteTitle()}</em>`].join(' ')

    if (publication.contributor)
      citation = [citation, publicationContributors()].join(', ')

    if (publishers())
      citation = [citation, publishers()].join('. ')

    if (pubDate)
      citation = [citation, pubYear({ date: pubDate })].join(', ');

    const url = page.url || identifier.url;
    if (url)
      citation = [citation, `<span class='url-string'>${url}</span>.`].join('. ');

    return oneLine`${citation}`
  };
};
