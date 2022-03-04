const { oneLine } = require('common-tags')

/**
 * A figure label element
 * @param  {Object} eleventyConfig  eleventy configuration
 * @param  {Object} globalData
 * @return
 */
module.exports = function(eleventyConfig, globalData) {
  const { config } = globalData
  const icon = eleventyConfig.getFilter('icon')
  const markdownify = eleventyConfig.getFilter('markdownify')
  const modalLink = eleventyConfig.getFilter('qfiguremodallink')
  const slugify = eleventyConfig.getFilter('slugify')

  return function(params) {
    const { figure } = params

    let labelElement

    if (config.epub) {
      labelElement = `<span class="q-figure__label">${markdownify(figure.label)}</span>`
    } else {
      const modifier = config.params.figureLabelLocation || ''

      let content = config.params.figureLabelLocation === 'on-top' 
      ? `<span class="q-figure__label-icon">${icon('fullscreen', 'Expand')}</span>`
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
