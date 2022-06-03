/**
 * Adapts Quire publication data to the CSL-JSON "book" type
 * https://docs.citationstyles.org/en/stable/specification.html
 * 
 * @return {Object}                CSL-JSON book
 */
module.exports = function (eleventyConfig) {
  const pubYear = eleventyConfig.getFilter("pubYear");
  const siteTitle = eleventyConfig.getFilter("siteTitle");

  const {
    contributor: publicationContributors,
    publisher: publishers,
  } = eleventyConfig.globalData.publication;

  return function (params) {
    let { context } = params;

    return {
      id: context,
      author: publicationContributors
        .filter(({ type }) => type === "primary")
        .map(({ first_name, full_name, last_name }) => {
          const family = last_name || full_name.split(" ").pop();
          const given = first_name || full_name.split(" ")[0];
          return { family, given };
        }),
      editor: publicationContributors
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
      title: `<em>${siteTitle()}</em>`,
      type: "book",
    };
  };
};
