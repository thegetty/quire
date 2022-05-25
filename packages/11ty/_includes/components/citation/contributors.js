/**
 * Renders MLA or Chicago-style lists of cited contributors
 *
 * @param     {Object}  eleventyConfig
 */
module.exports = function (eleventyConfig) {
  const fullname = eleventyConfig.getFilter('fullname');
  const getContributor = eleventyConfig.getFilter('getContributor');

  /**
   * @param     {Object}  params
   * @property  {Array}   contributors
   * @property  {Number}  max The maximum number of contributors who will be listed by name.
   *                          If there are more contributors than the max, ", et al" will be appended.
   * @property  {Boolean} reverse If true, returns family name before given name
   * @property  {Boolean} reverseFirst If true, reverses the  name in the list
   * @property  {Number}  truncatedMax (optional) The number of items to display if there are more then the max number of items
   * @return {String}
   */
  return function (params) {
    const { contributors, max, reverse, reverseFirst, truncatedMax } = params;
    if (!Array.isArray(contributors) || !contributors.length) return '';

    const contributorObjects = contributors.map((item) => getContributor(item));

    const defaultSeparator = ', '
    const finalSeparator =
      (contributors.length === 2 || max === 2)
        ? ' and '
        : ', and '
    /**
     * If there are more than the `max` number of contributors, show the `truncatedMax` number of items
     * if there are up to the `max` number of contributors, show all of the contributors
     */
    const maxItems = contributors.length > max && truncatedMax ? truncatedMax : max

    let pageContributors = contributorObjects.slice(0, max).reduce((previous, current, index) => {
      const lastContributor = index + 1 === contributors.length || index + 1 === maxItems;
      const reverseName = index === 0 && reverseFirst || reverse
      const separator = lastContributor ? finalSeparator : defaultSeparator

      const item = fullname(current, { reverse: reverseName })

      return !previous.length ? item : [previous, separator, item].join('');
    }, [])

    pageContributors = pageContributors.replace(/\.$/, '')

    return contributors.length > max
      ? (pageContributors += ', et al')
      :  pageContributors;
  };
};
