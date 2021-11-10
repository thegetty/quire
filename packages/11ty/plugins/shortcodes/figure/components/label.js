const { oneLine } = require('common-tags')
/**
 * A figure label element
 * @params {string} label - the figure's label
 * @params {string} link - the link that opens the figure modal element. If provided, the label will include a fullscreen icon.
 * @return
 */
module.exports = function(eleventyConfig, { config }, figure) {
  const { caption, id, label, src } = figure
  const markdownify = eleventyConfig.getFilter('markdownify')
  const modalLink = eleventyConfig.getFilter('qfiguremodallink')
  const qicon = eleventyConfig.getFilter('qicon')
  const slugify = eleventyConfig.getFilter('slugify')

  let labelElement

  if (config.epub) {
    labelElement = `<span class="q-figure__label">${markdownify(label)}</span>`
  } else {
    const modifier = config.params.figureLabelLocation || ''

    let content = config.params.figureLabelLocation === 'on-top' 
    ? `<span class="q-figure__label-icon">${qicon('fullscreen', 'Expand')}</span>` 
    : ''
    content += `<span class="q-figure__label-text">${markdownify(label || '')}</span>`

    content = modifier === 'below' ? modalLink(figure, content) : content

    labelElement = `<span class="q-figure__label q-figure__label--${modifier}">
      ${content}
    </span>`
  }

  return oneLine`${labelElement}`
}
