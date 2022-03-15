const { html } = require('common-tags')
/**
 * @param  {Object} eleventyConfig
 * @param  {Object} globalData
 * @param  {Object} params
 * @property  {Array<Object>} contributor Page contributors
 * @property  {String} contributorAsItAppears Text override for contributor field
 * @property  {String} contributorByline Style of byline 'name||name-title'
 * 
 * @return {String} Contributor markup for inclusion in page headers
 */
module.exports = function(eleventyConfig, globalData) {
  const contributorList = eleventyConfig.getFilter('contributorList')
  const markdownify = eleventyConfig.getFilter('markdownify')

  const { contributorByline: globalContributorByline } = globalData.config.params

  return function (params) {
    const {
      contributor: contributors,
      contributor_as_it_appears: contributorAsItAppears,
      contributor_byline: pageContributorByline
    } = params

    if (!pageContributorByline && !globalContributorByline) return ''

    const format = pageContributorByline || globalContributorByline

    const contributorElement = contributorAsItAppears || contributorList({ contributors, format })

    return html`
      <div class="quire-page__header__contributor">
        ${contributorElement}
      </div>
    `
  }
}
