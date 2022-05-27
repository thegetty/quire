/**
 * Chicago Style Publication Contributors
 *
 * @param  {Object} eleventyConfig
 * @param {Object} params
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

    citation.push(
      citeContributors({
        contributors: primaryContributors,
        max: 10,
        truncatedMax: 7
      })
    );

    const editorString = editorCount > 1 ? 'eds' : 'ed';
    if (editorCount) citation.push(`, ${editorString}`);

    return citation.join('');
  };
};
