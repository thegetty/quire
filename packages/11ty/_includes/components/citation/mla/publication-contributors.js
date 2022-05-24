/**
 * MLA Publication Contributors
 *
 * @param  {Object} eleventyConfig
 * @param  {Object} params
 * @property  {String} context - If the publication contributors are being included in a "page" or "publication" citation
 *
 * @example
 * "First Last."
 * "First Last and First Last."
 * "First Last and First Last, et al."
 */
module.exports = function (eleventyConfig) {
  const citeContributors = eleventyConfig.getFilter("citeContributors");
  const { contributor: contributors } = eleventyConfig.globalData.publication;

  return function (params) {
    const { context } = params;
    const primaryContributors = contributors.filter(
      ({ type }) => type === "primary"
    );
    const editors = contributors.filter(({ role }) => role === "editor");
    const editorCount = editors.length;

    let citation = [];

    if (context === "page") {
      if (editorCount) citation.push("edited ");
      citation.push("by ");
    }

    citation.push(
      citeContributors({
        contributors: primaryContributors,
        max: 2,
      })
    );

    if (context === "publication") {
      const editorString = editorCount > 1 ? "editors" : "editor";
      if (editorCount) citation.push(`, ${editorString}`);
    }

    return citation.join("");
  };
};
