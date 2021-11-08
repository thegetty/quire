const { html } = require('common-tags')

/**
 * Figure caption and credit
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {String} data   Caption and credit content to render
 * @property   {String} data.caption
 * @property   {String} data.credit
 * @property   {String} data.label  Used for the link to open the modal and for epub output when `figureLabelPosition` === 'below'
 * @property   {String} data.link   URL used to open the figure modal element
 * @return     {String}  An HTML <figcaption> element
 */
module.exports = function(eleventyConfig, data) {
  const markdownify = eleventyConfig.getFilter('markdownify')
  const slugify = eleventyConfig.getFilter('slugify')

  const { caption, credit, label, link } = data

  const labelElement = ''

  if (this.config.epub) {
    labelElement = `<span class="q-figure__label">${markdownify(label)}</span>`
  } else if (this.config.figureLabelLocation === 'below') {
    labelElement = html`
      <a
        class="inline popup"
        data-type="inline"
        href="${slugify(link)}"
        title="${caption}"
      >
        {% render 'figures/label.html', label, link %}
      </a>
    `
  }

  return html`
    <figcaption class="q-figure__caption">
      ${labelElement}
      <span class="q-figure__caption-content">${markdownify(caption)}</span>
      <span class="q-figure__credit">${markdownify(credit)}</span>
    </figcaption>
  `
}
