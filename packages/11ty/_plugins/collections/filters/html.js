const outputFilter = require('./output')
/**
 * Returns `true` if page should be built for html output
 * @param  {Object} page Eleventy page object
 * @return {Boolean}
 */
module.exports =  function (page) {
  return outputFilter('html', page)
}
