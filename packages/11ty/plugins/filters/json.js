/**
 * Replaces the default liquidjs json filter with specific arguments
 * @param      {Object}  data    JSON data to pretty print
 * @return     {String}  A formatted JSON string
 */
module.exports = function(data) {
  return JSON.stringify(data, null, 2)
}
