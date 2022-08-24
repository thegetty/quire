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

  const { epub } = eleventyConfig.globalData.config

  return function({ caption, id, label }) {
    let labelElement

    if (epub) {
      labelElement = `<span class="q-figure__label">${markdownify(label)}</span>`
    } else {
      let content = `<span class="q-figure__label-icon">${icon({ type: 'fullscreen', description: 'Expand' })}</span>`
      content += `<span class="q-figure__label-text">${markdownify(label || '')}</span>`

      content = modalLink({ caption, content, id })

      labelElement = `<span class="q-figure__label q-figure__label--below">
        ${content}
      </span>`
    }

    return oneLine`${labelElement}`
  }
}
