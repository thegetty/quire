const { html } = require('common-tags')

module.exports = function (eleventyConfig, globalData) {
  const { config } = globalData
  const icon = eleventyConfig.getFilter('icon')
  const markdownify = eleventyConfig.getFilter('markdownify')

  return function(params) {
    const { figure, content } = params
    const { caption, id } = figure

    const iconElement = config.params.figureLabelLocation === 'below'
      ? icon('fullscreen', 'Expand')
      : ''
    return config.params.figureModal
      ? html`<a
          href="#deepzoom-${ id }"
          class="inline popup"
          data-type="inline"
          title="${markdownify(caption || '')}">
          <span class="q-figure__label-icon">${iconElement}</span>
          ${content}
        </a>`
      : content
  }
}
