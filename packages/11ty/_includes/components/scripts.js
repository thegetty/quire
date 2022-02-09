/**
 * @param  {Object} eleventyConfig
 * @param  {Object} data
 * 
 * @return {String} script tags
 */
module.exports = function(eleventyConfig, data) {
  const { config } = data
  return `
    <script type="text/javascript"> var figureModal = ${config.params.figureModal}</script>
    <script type="module" src="/_assets/javascript/application/index.js"></script>
    <script type="module" src="/_assets/javascript/custom.js"></script>
  `
}
