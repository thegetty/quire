module.exports = function(array, separator=', ', finalSeparator) {
  finalSeparator = finalSeparator || separator
  if (array.length <= 1) return array.join(separator)
  const last = array.pop()
  return [array.join(separator), last].join(finalSeparator)
}
