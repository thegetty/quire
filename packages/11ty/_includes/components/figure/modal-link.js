const { html } = require('common-tags')

module.exports = function (eleventyConfig) {
  const icon = eleventyConfig.getFilter('icon')
  const markdownify = eleventyConfig.getFilter('markdownify')

  const { figureLabelLocation, figureModal } = eleventyConfig.globalData.config.params

  return function({ caption, content, id }) {

    const iconElement = figureLabelLocation === 'below'
      ? icon({ type: 'fullscreen', description: 'Expand' })
      : ''

    return figureModal
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
