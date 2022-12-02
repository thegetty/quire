const outputFilter = require('./output')

/**
 * Returns `true` if page should be included in the HTML build of the Table of Contents
 * @param  {Object} page Eleventy `page` object
 * @return {Boolean}
 */
module.exports = function(page) {
  const { toc, type } = page.data
  return (outputFilter('html', page) || toc === true) && toc !== false && type !== 'data'
}
