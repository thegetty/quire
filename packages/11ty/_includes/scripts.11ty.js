module.exports = function(data) {
  return `
    <!--<script type="text/javascript"> var figureModal ={{ .figureModal }}</script>-->
    <script src="/js/application.js"></script>
    <script src="/js/custom.js"></script>
  `
}
