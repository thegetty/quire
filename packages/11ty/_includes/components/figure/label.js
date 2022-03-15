const { oneLine } = require('common-tags')

/**
 * A figure label element
 * @param  {Object} eleventyConfig  eleventy configuration
 * @param  {Object} globalData
 * @return
 */
module.exports = function(eleventyConfig, globalData) {
  const icon = eleventyConfig.getFilter('icon')
  const markdownify = eleventyConfig.getFilter('markdownify')
  const modalLink = eleventyConfig.getFilter('figuremodallink')

  const { epub } = globalData.config
  const { figureLabelLocation } = globalData.config.params

  return function({ figure }) {

    let labelElement

    if (epub) {
      labelElement = `<span class="q-figure__label">${markdownify(figure.label)}</span>`
    } else {
      const modifier = figureLabelLocation || ''

      let content = figureLabelLocation === 'on-top'
      ? `<span class="q-figure__label-icon">${icon({ type: 'fullscreen', description: 'Expand' })}</span>`
      : ''
      content += `<span class="q-figure__label-text">${markdownify(figure.label || '')}</span>`

      content = modifier === 'below' ? modalLink({ figure, content }) : content

      labelElement = `<span class="q-figure__label q-figure__label--${modifier}">
        ${content}
      </span>`
    }

    return oneLine`${labelElement}`
  }
}
