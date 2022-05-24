const { html } = require('common-tags');
/**
 * @param  {Object} eleventyConfig
 * @param  {Object} params
 * @property  {Object} publication
 * @property  {Object} page
 */
module.exports = function (eleventyConfig) {
  const citationContributors = eleventyConfig.getFilter('citationContributors');
  const publicationContributors = eleventyConfig.getFilter('citationChicagoPublicationContributors');
  const publishers = eleventyConfig.getFilter('citationChicagoPublishers');
  const citationPubDate = eleventyConfig.getFilter('citationPubDate');
  const { config, publication } = eleventyConfig.globalData;
  const pageTitle = eleventyConfig.getFilter('pageTitle');
  const siteTitle = eleventyConfig.getFilter('siteTitle');

  return function (params) {
    const { page } = params;
    const { contributor: contributors, label, subtitle, title } = page.data;
    const { pub_date: pubDate } = publication;

    const pageContributorsElement = contributors && citationContributors({
      contributors,
      max: 3,
      reverseFirst: true
    });

    let pageTitleElement = title
      ? `${pageTitle({ subtitle, title })}.`
      : label || 'Untitled.';

    let publicationCitation = [
      `In <em>${siteTitle()}</em>`,
      publicationContributors({ contributors: publication.contributor }),
    ]
      .filter((item) => item)
      .join(', ');

    publicationCitation = [
      publicationCitation,
      publishers({ publication }),
    ].join(' ');

    const dateCitation = citationPubDate({ date: pubDate });
    if (dateCitation)
      publicationCitation = [publicationCitation, `${dateCitation}.`].join(
        ', '
      );

    const url = page.url || identifier.url;
    const urlElement = url && `<span class='url-string'>${url}</span>.`;

    return html`${[
      pageContributorsElement,
      `“${pageTitleElement}”`,
      publicationCitation,
      urlElement,
    ]
      .filter((item) => item)
      .join(' ')}`;
  };
};
