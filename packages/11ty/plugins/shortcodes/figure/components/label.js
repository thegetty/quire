const { oneLine } = require('common-tags')

/**
 * A figure label element
 * @params {string} label - the figure's label
 * @params {string} link - the link that opens the figure modal element. If provided, the label will include a fullscreen icon.
 * @return
 */
module.exports = function(eleventyConfig, { label, link }) {
  const markdownify = eleventyConfig.getFilter('markdownify')
  const slugify = eleventyConfig.getFilter('slugify')

  const labelIcon = link //&& showIcon
    ? `<span class="q-figure__label-icon">
        {% render 'icon.html' 'type' 'fullscreen' 'description' 'Expand' %}
      </span>`
    : ''

  const modifier = this.config.figureLabelLocation || ''

  return oneLine`
    <span class="q-figure__label q-figure__label--${modifier}">
      ${labelIcon}
      <span class="q-figure__label-text">${label}</span>
    </span>
  `
}
