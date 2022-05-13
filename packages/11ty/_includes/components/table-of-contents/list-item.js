const { html, oneLine } = require('common-tags')

/**
 * Renders a TOC list item
 *
 * @param     {Object} context
 * @param     {String} params
 * @property  {Array} children - The TOC page item's child pages
 * @property  {String} page - The TOC item's page data
 * @property  {String} presentation How the TOC should display. Possible values: ['abstract', 'brief']
 *
 * @return {String} TOC list item markup
 */
module.exports = function (eleventyConfig) {
  const contributorList = eleventyConfig.getFilter('contributorList')
  const icon = eleventyConfig.getFilter('icon')
  const markdownify = eleventyConfig.getFilter('markdownify')
  const pageTitle = eleventyConfig.getFilter('pageTitle')
  const removeHTML = eleventyConfig.getFilter('removeHTML')
  const urlFilter = eleventyConfig.getFilter('url')

  return function (params) {
    const {
      children='',
      classes=[],
      page,
      presentation
    } = params

    const {
      abstract,
      contributor: pageContributors,
      label,
      layout,
      online,
      short_title,
      subtitle,
      summary,
      title,
      weight
    } = page.data

    const isOnline = online !== false

    const pageContributorList = contributorList({ contributors: pageContributors })
    const pageContributorsElement = pageContributorList
      ? `<span class="contributor"> — ${pageContributorList}</span>`
      : ''

    let pageTitleElement
    if (presentation === 'brief') {
      pageTitleElement = short_title || title
    } else {
      pageTitleElement = oneLine`${pageTitle({ label, subtitle, title })}${pageContributorsElement}`
    }
    const arrowIcon = `<span class="arrow remove-from-epub">&nbsp${icon({ type: 'arrow-forward', description: '' })}</span>`

    // Returns abstract with any links stripped out
    const abstractText =
      presentation === 'abstract' && (abstract || summary)
        ? `<div class="abstract-text">${ removeHTML(markdownify(abstract)) }</div>`
        : ''

    let mainElement = `${markdownify(pageTitleElement)}${isOnline && !children ? arrowIcon : ''}`

    if (isOnline) {
      mainElement = `<a href="${urlFilter(page.url)}">${mainElement}</a>`
    } else {
      classes.push('no-landing')
    }

    return html`
      <li class="${classes.join(' ')}">
        ${mainElement}
        ${abstractText}
        ${children}
      </li>
    `
  }
}
