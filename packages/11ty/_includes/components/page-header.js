const { html } = require('common-tags')
const path = require('path')

/**
 * Publication page header
 *
 * @param      {Object}  eleventyConfig
 * @param      {Object}  globalData
 */
module.exports = function(eleventyConfig, globalData) {
  const markdownify = eleventyConfig.getFilter('markdownify')
  const slugify = eleventyConfig.getFilter('slugify')

  const { imgDir, pageLabelDivider } = globalData.config.params

  return function (params) {
    const {
      contributor,
      contributor_as_it_appears,
      contributor_byline,
      image,
      label,
      subtitle,
      title
    } = params

    const classes = ['quire-page__header', 'hero']

    if (title == 'title page' || title == 'half title page') {
      classes.push('is-screen-only')
    }

    const pageLabel = label
      ? `<span class="label">${label}<span class="visually-hidden">${pageLabelDivider}</span></span>`
      : ''

    const imageElement = image
      ? html`
          <section
            class="${classes} hero__image"
           style="background-image: url('${path.join(imgDir, image)}');"
          >
          </section>
        `
      : ''

    return html`
      <section class="${classes}">
        <div class="hero-body">
          <h1 class="quire-page__header__title" id="${slugify(title)}">
            ${pageLabel}
            {% pageTitle title=title, subtitle=subtitle -%}
          </h1>
          {% contributorHeader
            contributor=contributor,
            contributor_as_it_appears=contributor_as_it_appears,
            contributor_byline=contributor_byline
          %}
        </div>
      </section>
      ${image}
    `
  }
}
