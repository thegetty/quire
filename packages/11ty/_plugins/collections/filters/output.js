/**
 * Helper filter for outputs
 * @param {String} outputType 'epub', 'html', or 'pdf'
 * @param {Object} page Eleventy page
 */
module.exports =  function (outputType, page) {
  const { outputs } = page.data
  return outputs !== 'none' &&
    outputs !== false &&
    (!outputs ||
      Array.isArray(outputs) && outputs.includes(outputType) ||
      outputs === outputType)
}
