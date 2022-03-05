/**
 * @param  {Object} eleventyConfig
 * @param  {Object} globalData
 * 
 * @return {String} script tags
 */
module.exports = function(eleventyConfig, globalData) {
  const { config } = globalData
  return function() {
    return `
      <script type="text/javascript"> var figureModal = ${config.params.figureModal}</script>
      <script type="module" src="/_assets/javascript/application/index.js"></script>
      <script type="module" src="/_assets/javascript/custom.js"></script>
    `
  }
}
