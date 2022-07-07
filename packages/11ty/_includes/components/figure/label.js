const { oneLine } = require('~lib/common-tags')

/**
 * A figure label element
 * @param  {Object} eleventyConfig  eleventy configuration
 * @return
 */
module.exports = function(eleventyConfig) {
  const icon = eleventyConfig.getFilter('icon')
  const markdownify = eleventyConfig.getFilter('markdownify')
  const modalLink = eleventyConfig.getFilter('figuremodallink')

  const { epub } = eleventyConfig.globalData.config
  const { figureLabelLocation } = eleventyConfig.globalData.config.params

  return function({ caption, id, label }) {
    let labelElement

    if (epub) {
      labelElement = `<span class="q-figure__label">${markdownify(label)}</span>`
    } else {
      const modifier = figureLabelLocation || ''

      let content = figureLabelLocation === 'on-top'
      ? `<span class="q-figure__label-icon">${icon({ type: 'fullscreen', description: 'Expand' })}</span>`
      : ''
      content += `<span class="q-figure__label-text">${markdownify(label || '')}</span>`

      content = modifier === 'below' ? modalLink({ caption, content, id }) : content

      labelElement = `<span class="q-figure__label q-figure__label--${modifier}">
        ${content}
      </span>`
    }

    return oneLine`${labelElement}`
  }
}
