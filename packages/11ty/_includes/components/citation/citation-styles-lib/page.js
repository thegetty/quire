const Processor = require("simple-cite");
const chicago = require("style-chicago");
const locale = require("locale-en-us");
const mla = require("style-mla");

/**
 * Adapts Quire page data to the CSL-JSON "webpage" type
 * https://docs.citationstyles.org/en/stable/specification.html
 *
 * @return {Object} CSL-JSON page
 */
module.exports = function (eleventyConfig) {
  const getContributor = eleventyConfig.getFilter("getContributor");
  const pageTitle = eleventyConfig.getFilter("pageTitle");
  const pubYear = eleventyConfig.getFilter("pubYear");
  const siteTitle = eleventyConfig.getFilter("siteTitle");

  const {
    contributor: publicationContributors,
    publisher: publishers,
  } = eleventyConfig.globalData.publication;

  return function (params) {
    let { context, page } = params;
    const pageContributors = page.data.contributor.map((item) =>
      getContributor(item)
    );

    return {
      id: context,
      "container-title": siteTitle(),
      type: "webpage",
      author: pageContributors
        .filter(({ type }) => type === "primary")
        .map(({ first_name, full_name, last_name }) => {
          const family = last_name || full_name.split(" ").pop();
          const given = first_name || full_name.split(" ")[0];
          return { family, given };
        }),
      editor: pageContributors
        .filter(({ role }) => role === "editor")
        .map(({ first_name, full_name, last_name }) => {
          const family = last_name || full_name.split(" ").pop();
          const given = first_name || full_name.split(" ")[0];
          return { family, given };
        }),
      issued: {
        "date-parts": [[pubYear()]],
      },
      publisher: publishers[0].name,
      "publisher-place": publishers[0].location,
      title: pageTitle(page.data),
      URL: page.url,
    };
  };
};
