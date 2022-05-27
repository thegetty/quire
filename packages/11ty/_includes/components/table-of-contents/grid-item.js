const path = require ('path')
const { html, oneLine } = require('common-tags')

/**
 * Renders a TOC item
 *
 * @param     {Object} context
 * @param     {String} params
 * @property  {Array} children - The TOC page item's child pages
 * @property  {String} page - The TOC item's page data
 *
 * @return {String} TOC item markup
 */
module.exports = function (eleventyConfig) {
  const contributors = eleventyConfig.getFilter('contributors')
  const getFigure = eleventyConfig.getFilter('getFigure')
  const getObject = eleventyConfig.getFilter('getObject')
  const icon = eleventyConfig.getFilter('icon')
  const markdownify = eleventyConfig.getFilter('markdownify')
  const pageTitle = eleventyConfig.getFilter('pageTitle')
  const tableOfContentsImage = eleventyConfig.getFilter('tableOfContentsImage')
  const urlFilter = eleventyConfig.getFilter('url')
  const { imageDir } = eleventyConfig.globalData.config.params

  return function (params) {
    const {
      children='',
      classes=[],
      page
    } = params

    const {
      contributor: pageContributors,
      figure: pageFigure,
      image,
      label,
      layout,
      object: pageObject,
      online,
      short_title,
      subtitle,
      summary,
      title
    } = page.data

    const isOnline = online !== false

    const pageContributorsElement = pageContributors
      ? `<span class="contributor"> — ${contributors({ context: pageContributors, format: 'string' })}</span>`
      : ''
    const pageTitleElement = oneLine`${pageTitle({ label, subtitle, title })}${pageContributorsElement}`
    const arrowIcon = `<span class="arrow remove-from-epub">&nbsp${icon({ type: 'arrow-forward', description: '' })}</span>`
    let mainElement = `${markdownify(pageTitleElement)}${isOnline && !children ? arrowIcon : ''}`
    /**
     * Create cards for page items
     */
    const imageAttribute = image || pageFigure || pageObject ? "image" : "no-image"
    const slugPageAttribute = children ? "slug-page" : ""

    let imageElement
    switch (true) {
      case !!image:
        imageElement = html`<div class="card-image">
            <figure class="image">
              <img src="${path.join(imageDir, image)}" alt="" />
            </figure>
          </div>`
        break
      case !!pageFigure:
        const firstFigure = firstPageFigure ? getFigure(pageFigure[0]) : null
        imageElement = firstFigure ? tableOfContentsImage({ imageDir, src: firstFigure.src }) : ''
        break
      case !!pageObject:
        const firstObjectId = pageObject[0].id
        const object = getObject(firstObjectId)
        const firstObjectFigure = object ? getFigure(object.figure[0].id) : null
        imageElement = firstObjectFigure ? tableOfContentsImage({ imageDir, src: firstObjectFigure.src }) : ''
        break
      default:
        imageElement = ''
        break;
    }

    if (!children) {
      mainElement = html`
        <div class="card ${imageAttribute} ${slugPageAttribute}">
          ${imageElement}
          <div class="card-content">
            ${mainElement}
          </div>
        </div>
      `
    }

    if (isOnline) {
      mainElement = html`
        <a href="${urlFilter(page.url)}">
          ${mainElement}
        </a>
      `
    } else {
      mainElement = html`
        <div class="list-header">
          ${mainElement}
        </div>
      `
      classes.push('no-landing')
    }

    return html`
      <li class="${classes.join(' ')}">
        ${mainElement}
        ${children}
      </li>
    `
  }
}
