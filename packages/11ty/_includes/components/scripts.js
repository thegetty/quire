const { html } = require('~lib/common-tags')

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
  return () => html`
    <script type="module" src="/_assets/javascript/application/index.js"></script>
  `
}
