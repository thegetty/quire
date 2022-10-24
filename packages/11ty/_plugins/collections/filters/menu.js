const outputFilter = require('./output')

/**
 * Returns `true` if page should be included in the menu
 * @param  {Object} page Eleventy `page` object
 * @return {Boolean}
 */
module.exports = function(page) {
  const { menu, type } = page.data
  return (outputFilter('html', page) || menu === true) && menu !== false && type !== 'data'
}
