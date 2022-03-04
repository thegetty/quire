const { html } = require('common-tags')

module.exports = function (context, { caption, id }, content) {
  const { eleventyConfig, globalData: { config } } = context
  const icon = eleventyConfig.getFilter('icon')
  const markdownify = eleventyConfig.getFilter('markdownify')
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
