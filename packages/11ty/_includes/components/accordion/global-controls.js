const { html } = require('~lib/common-tags')

/**
 * @param {Object} eleventyConfig
 * @returns Global Accordion Controls Shortcode
 */
module.exports = function(eleventyConfig) {
  const { collapseText, expandText } = eleventyConfig.globalData.config.accordion.globalControls

  /**
   * @return {String} html markup for global accordion controls
   */
  return function() {
    return html`
      <div class="global-accordion-controls" data-outputs-exclude="pdf,epub">
        <button class="global-accordion-expand-all visually-hidden">${expandText}</button>
        <button class="global-accordion-collapse-all visually-hidden">${collapseText}</button>
      </div>`
  }
}
