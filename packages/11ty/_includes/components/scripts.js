/**
 * @param  {Object} context
 * 
 * @return {String} script tags
 */
module.exports = function({ globalData }) {
  const { config } = globalData
  return `
    <script type="text/javascript"> var figureModal = ${config.params.figureModal}</script>
    <script type="module" src="/_assets/javascript/application/index.js"></script>
    <script type="module" src="/_assets/javascript/custom.js"></script>
  `
}
