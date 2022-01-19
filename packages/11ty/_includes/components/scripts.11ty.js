module.exports = function({ config }) {
  return `
    <script type="text/javascript"> var figureModal = ${config.params.figureModal}</script>
    <script type="module" src="/_assets/javascript/application/index.js"></script>
    <script type="module" src="/_assets/javascript/custom.js"></script>
  `
}
