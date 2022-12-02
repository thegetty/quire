/**
 * Truncate a string
 * @param  {String} text  The string to truncate
 * @param  {Number} limit The maximum number of characters to return
 */
module.exports = (text, limit) => text?.slice(0, limit)
