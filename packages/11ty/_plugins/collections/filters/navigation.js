const outputFilter = require('./output')

/**
 * Returns `true` if page should be included in the pagination
 * @param  {Object} page Eleventy `page` object
 * @return {Boolean}
 */
module.exports = function(page) {
  return outputFilter('html', page) && page.data.type !== 'data'
}
