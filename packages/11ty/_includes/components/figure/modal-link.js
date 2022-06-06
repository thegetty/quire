const { html } = require('common-tags')

module.exports = function (eleventyConfig) {
  const icon = eleventyConfig.getFilter('icon')
  const markdownify = eleventyConfig.getFilter('markdownify')

  const { labelPosition, enableModal } = eleventyConfig.globalData.config.params.figures

  return function({ caption, content, id }) {

    const iconElement = labelPosition === 'below'
      ? icon({ type: 'fullscreen', description: 'Expand' })
      : ''

    return enableModal
      ? html`<a
          href="#${id}"
          class="q-figure__modal-link"
        >
          <span class="q-figure__label-icon">${iconElement}</span>
          ${content}
        </a>`
      : content
  }
}
