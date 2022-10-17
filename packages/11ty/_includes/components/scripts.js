/**
 * Generate HTML <script> tags for document head
 *
 * Nota bene: is-land bundle must be the first defined when using web-components
 * @see https://www.11ty.dev/docs/plugins/partial-hydration/#installation
 *
 * @param  {EleventyConfig} eleventyConfig
 * @return {String} HTML <script> tags
 */
module.exports = function(eleventyConfig) {
  const { config } = eleventyConfig.globalData

  return () => html`
    <script type="module" src="/is-land.js"></script>
    <script type="text/javascript">
      const figureModal = ${config.params.figureModal}
    </script>
    <script type="module" src="/_assets/javascript/application/index.js"></script>
    <script type="module" src="/_assets/javascript/custom.js"></script>
  `
}
