/**
 * Renders quire page classes
 *
 * @param {Object} eleventyConfig
 *
 * @param {Object} params
 *
 * @return {String} quire page classes
 */
module.exports = function(eleventyConfig) {
  return function({ pages, pagination }) {
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
