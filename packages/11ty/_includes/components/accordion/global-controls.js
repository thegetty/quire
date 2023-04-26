const { html } = require('~lib/common-tags')

module.exports = function(eleventyConfig) {
  const { accordion: accordionConfig } = eleventyConfig.globalData.config

  return function(params) {
    const { accordion: accordionPageConfig={} } = params

    /**
     * Merge page and global config
     */
    const accordionControls = Object.assign({...accordionConfig.globalControls}, {...accordionPageConfig.globalControls|| {}})
    return accordionControls.enable
      ? html`
        <div class="global-accordion-controls">
          <button class="global-accordion-expand-all">${accordionControls.expand}</button>
          <button class="global-accordion-collapse-all">${accordionControls.collapse}</button>
        </div>`
      : ''
  }
}
