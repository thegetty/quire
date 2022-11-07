const { oneLine } = require('~lib/common-tags')

/**
 * A figure label element
 * @param  {Object} eleventyConfig  eleventy configuration
 * @return
 */
module.exports = function(eleventyConfig) {
  const icon = eleventyConfig.getFilter('icon')
  const markdownify = eleventyConfig.getFilter('markdownify')
  const modalLink = eleventyConfig.getFilter('figureModalLink')

  return function({ id, label }) {
    if (!label) return ''

    const labelText = `<a class="q-figure__reset-link q-figure__reset-link--disabled" alt="Reset figure">
      <span class="q-figure__label-text">${markdownify(label || '')}</span>
    </a>`
    const fullscreenIcon = modalLink({
      content: `<span class="q-figure__label-icon">${icon({ type: 'fullscreen', description: 'Expand' })}</span>`,
      id
    })

    return oneLine`
      <span class="q-figure__label q-figure__label--below">
        ${labelText}${fullscreenIcon}
      </span>
    `
  }
}
