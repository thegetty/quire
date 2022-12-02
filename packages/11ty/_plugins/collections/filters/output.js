/**
 * Helper filter for outputs
 * Returns `true` if page should be output to provided output type
 * Defaults to `true` if no outputs are defined on the page
 * @param {String} type 'epub', 'html', or 'pdf'
 * @param {Object} page Eleventy page
 */
module.exports =  function (type, page) {
  const { outputs } = page.data
  const useDefault = !outputs
  const pageOutputMatchesType = Array.isArray(outputs) && outputs.includes(type) || outputs === type
  return useDefault || pageOutputMatchesType
}
