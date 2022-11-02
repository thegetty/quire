module.exports = function(eleventyConfig) {
  const renderOutputs = eleventyConfig.getFilter('renderOutputs')
  return function(params) {
    return renderOutputs(__dirname, params)
  }
}
