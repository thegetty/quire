/**
 * @param  {Object} eleventyConfig
 * 
 * @return {String} script tags
 */
module.exports = function(eleventyConfig) {
  const { config } = eleventyConfig.globalData
  return function() {
    return `
      <script type="text/javascript"> var figureModal = ${config.params.figureModal}</script>
      <script type="module" src="/_assets/javascript/application/index.js"></script>
      <script type="module" src="/_assets/javascript/custom.js"></script>
    `
  }
}
