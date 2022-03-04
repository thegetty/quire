const { html } = require('common-tags')

module.exports = function (eleventyConfig, globalData) {
  const icon = eleventyConfig.getFilter('icon')
  const markdownify = eleventyConfig.getFilter('markdownify')

  const { figureLabelLocation, figureModal } = globalData.config.params

  return function({ content, figure }) {
    const { caption, id } = figure

    const iconElement = figureLabelLocation === 'below'
      ? icon('fullscreen', 'Expand')
      : ''
    return figureModal
      ? html`<a
          href="#deepzoom-${id}"
          class="inline popup"
          data-type="inline"
          title="${markdownify(caption || '')}">
          <span class="q-figure__label-icon">${iconElement}</span>
          ${content}
        </a>`
      : content
  }
}
