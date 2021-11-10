module.exports = function({ config }) {
  return `
    <script type="text/javascript"> var figureModal = ${config.figureModal}</script>
    <script src="/js/application.js"></script>
    <script src="/js/custom.js"></script>
  `
}
