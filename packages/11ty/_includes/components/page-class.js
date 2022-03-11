/**
 * Renders quire page classes
 *
 * @param {Object} eleventyConfig
 * @param {Object} globalData
 *
 * @param {Object} params
 *
 * @return {String} quire page classes
 */
module.exports = function(eleventyConfig, globalData) {
  return function(params) {
    const { pages, pagination } = params
    const { class: currentPageClass, weight: currentPageWeight } = pagination.currentPage.data
    const pageOne = pages.find(({ data }) => data.class === 'page-one')
    const { weight: pageOneWeight } = pageOne.data
    const baseClass = 'quire-page'
    const classes = [baseClass]

    if (currentPageWeight < pageOneWeight) {
      classes.push(`${baseClass}--frontmatter`)
    }

    if (currentPageClass) {
      classes.push(`${baseClass}--${currentPageClass}`)
    }

    return classes.join(' ')
  }
}
