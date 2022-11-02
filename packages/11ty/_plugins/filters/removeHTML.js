/**
 * Removes html tags from the provided string
 * @param      {String}
 * @return     {String}  String with no HTML
 */
module.exports = function(string) {
  return string.replace(/(<([^>]+)>)/gi, '')
}
