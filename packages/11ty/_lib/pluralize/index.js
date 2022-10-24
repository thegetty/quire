/**
 * Pluralize a string
 * @param  {Number} count  number of items
 * @param  {String} string word to pluralize
 * @param  {String} pluralized override for pluralized word if irregular, i.e. "mouse" and "mice"
 * @return {String} pluralized word
 */
module.exports = (count, string, pluralized) => {
  pluralized = pluralized || `${string}s`
  return count === 1 ? string : pluralized
}
