/**
 * Chicago Style Publication Contributors
 *
 * @param  {Object} eleventyConfig
 *
 * @example
 * 'First Last.'
 * 'First Last and First Last.'
 * 'First Last, First Last, and First Last.'
 * 'First Last, First Last, and First Last, et al.'
 */
module.exports = function (eleventyConfig) {
  const citeContributors = eleventyConfig.getFilter('citeContributors');
  const { contributor: contributors } = eleventyConfig.globalData.publication;

  return function (params) {
    const primaryContributors = contributors.filter(
      ({ type }) => type === 'primary'
    );
    const editors = contributors.filter(({ role }) => role === 'editor');
    const editorCount = editors.length;

    let citation = [];

    if (editorCount) citation.push('edited ');
    citation.push('by ');

    citation.push(
      citeContributors({
        contributors: primaryContributors,
        max: 3
      })
    );

    return citation.join('');
  };
};
