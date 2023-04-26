const { html } = require('~lib/common-tags')
const path = require('path')

/**
 * Publication page header
 *
 * @param      {Object}  eleventyConfig
 */
module.exports = function(eleventyConfig) {
  const contributors = eleventyConfig.getFilter('contributors')
  const pageTitle = eleventyConfig.getFilter('pageTitle')
  const slugify = eleventyConfig.getFilter('slugify')

  const { accordion: accordionConfig } = eleventyConfig.globalData.config
  const { labelDivider } = eleventyConfig.globalData.config.pageTitle
  const { imageDir } = eleventyConfig.globalData.config.figures

  return function (params) {
    const {
      accordion: accordionPageConfig={},
      byline_format: bylineFormat,
      image,
      label,
      pageContributors,
      subtitle,
      title
    } = params

    /**
     * Merge page and global config for accordion
     */
    const accordionControls = Object.assign({...accordionConfig.globalControls}, {...accordionPageConfig.globalControls|| {}})

    const classes = ['quire-page__header', 'hero']

    if (title == 'title page' || title == 'half title page') {
      classes.push('is-screen-only')
    }

    const pageLabel = label
      ? `<span class="label">${label}<span class="visually-hidden">${labelDivider}</span></span>`
      : ''

    const imageElement = image
      ? html`
          <section
            class="${classes} hero__image"
           style="background-image: url('${path.join(imageDir, image)}');"
          >
          </section>
        `
      : ''

    const contributorsElement = pageContributors
      ? html`
          <div class="quire-page__header__contributor">
            ${contributors({ context: pageContributors, format: bylineFormat })}
          </div>
        `
      : ''

    const globalAccordionControls = accordionControls.enable
      ? html`
        <div class="global-accordion-controls">
          <button class="global-accordion-expand-all">${accordionControls.expand}</button>
          <button class="global-accordion-collapse-all">${accordionControls.collapse}</button>
        </div>`
      : ''

    return html`
      <section class="${classes}">
        <div class="hero-body">
          <h1 class="quire-page__header__title" id="${slugify(title)}">
            ${pageLabel}
            ${pageTitle({ title, subtitle })}
          </h1>
          ${contributorsElement}
        </div>
        ${globalAccordionControls}
      </section>
      ${imageElement}
    `
  }
}
