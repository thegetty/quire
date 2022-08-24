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

  const { figureLabelLocation } = eleventyConfig.globalData.config.params

  return function({ caption, id, label }) {
    if (!label) return ''

    const modifier = figureLabelLocation || ''

    let content = `<span class="q-figure__label-icon">${icon({ type: 'fullscreen', description: 'Expand' })}</span>`
    content += `<span class="q-figure__label-text">${markdownify(label || '')}</span>`

    content =
      (modifier === 'below')
        ? modalLink({ caption, content, id })
        : content

    const labelElement = `<span class="q-figure__label q-figure__label--${modifier}">
      ${content}
    </span>`

    return oneLine`${labelElement}`
  }
}
