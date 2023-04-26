const path = require ('path')
const { html, oneLine } = require('~lib/common-tags')

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
  const { contributorDivider } = eleventyConfig.globalData.config.tableOfContents
  const { imageDir } = eleventyConfig.globalData.config.figures

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
      short_title,
      subtitle,
      summary,
      title
    } = page.data

    /**
     * Check if item is a reference to a built page or just a heading
     * @type {Boolean}
     */
    const isPage = !!layout

    const pageContributorsElement = pageContributors
      ? `<span class="contributor-divider">${contributorDivider}</span><span class="contributor">${contributors({ context: pageContributors, format: 'string' })}</span>`
      : ''
    const pageTitleElement = oneLine`${pageTitle({ label, subtitle, title })}${pageContributorsElement}`
    const arrowIcon = `<span class="arrow" data-outputs-exclude="epub,pdf">${icon({ type: 'arrow-forward', description: '' })}</span>`
    let mainElement = `${markdownify(pageTitleElement)}${isPage && !children ? arrowIcon : ''}`
    /**
     * Create cards for page items
     */
    const imageAttribute = image || pageFigure || pageObject ? 'image' : 'no-image'
    const slugPageAttribute = children ? 'slug-page' : ''

    let imageElement
    switch (true) {
      case !!image:
        imageElement = html`
          <div class="card-image">
            <figure class="image">
              <img src="${path.join(imageDir, image)}" alt="" />
            </figure>
          </div>
        `
        break
      case !!pageFigure: {
        const firstFigure = pageFigure[0] ? getFigure(pageFigure[0]) : null
        imageElement = firstFigure
          ? tableOfContentsImage({ src: firstFigure.src })
          : ''
        break
      }
      case !!pageObject: {
        const firstObjectId = pageObject[0].id
        const object = getObject(firstObjectId)
        const firstObjectFigure = object && object.figure
          ? getFigure(object.figure[0].id)
          : null
        imageElement = firstObjectFigure
          ? tableOfContentsImage({ src: firstObjectFigure.src })
          : ''
        break
      }
      default:
        imageElement = ''
        break
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

    if (isPage) {
      mainElement = html`
        <a href="${page.url}">
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
