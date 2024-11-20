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

  return function({ id, label, isSequence }) {
    if (!label) return ''

    let content = `<span class="q-figure__label-icon">${icon({ type: 'fullscreen', description: 'Expand' })}</span>`
    if (isSequence) {
      content += `<span class="q-figure__label-icon">${icon({ type: 'rotation', description: 'Click and drag to rotate' })}</span>`
    }
    content += `<span class="q-figure__label-text">${markdownify(label || '')}</span>`
    content = modalLink({ content, id })

    const labelElement = `<span class="q-figure__label q-figure__label--below">
      ${content}
    </span>`

    return oneLine`${labelElement}`
  }
}
