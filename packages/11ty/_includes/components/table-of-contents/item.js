const path = require ('path')
const { oneLine } = require('common-tags')

/**
 * Renders a TOC item
 *
 * @param     {Object} context
 * @param     {String} params
 * @property  {String} page - The TOC item's page data
 * @property  {String} type - The TOC type, "grid", "brief", or "abstract"
 *
 * @return {String} TOC item markup
 */
module.exports = function (eleventyConfig) {
  const contributorList = eleventyConfig.getFilter('contributorList')
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
      page,
      type
    } = params

    const {
      abstract,
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
      title,
      weight
    } = page.data

    /**
     * Return empty string if item is section index without a landing page or children
     */
    if (!children && online === false) return ''

    const brief = type.includes('brief')
    const grid = type.includes('grid')

    // const itemClassName = weight < pageOne.data.weight ? "frontmatter-page" : ""
    const itemClassName = ''
    const pageContributorList = contributorList({ contributors: pageContributors })
    const pageContributorsElement = pageContributorList
      ? `<span class="contributor"> — ${pageContributorList}</span>`
      : ''

    let pageTitleElement = ''
    if (short_title && brief) {
      pageTitleElement += short_title
    } else if (brief) {
      pageTitleElement += title
    } else {
      pageTitleElement += oneLine`${pageTitle({ label, subtitle, title })}${pageContributorsElement}`
    }
    const arrowIcon = `<span class="arrow remove-from-epub">&nbsp${icon({ type: 'arrow-forward', description: '' })}</span>`

    // Returns abstract with any links stripped out
    const abstractText =
      type === 'abstract' && (abstract || summary)
        ? `<div class="abstract-text">
            {{ markdownify(abstract) | replaceRE "</?a(|\\s*[^>]+)>" "" | strip_html }}
        </div>`
        : ''

    let mainElement = `
      <div class="title">
        ${markdownify(pageTitleElement)}
        ${online !== false ? arrowIcon : ''}
      </div>
    `

    if (grid) {
      const imageAttribute = pageFigure || pageObject ? "image" : "no-image"
      const slugPageAttribute = layout === 'contents' ? "slug-page" : ""
      let imageElement
      switch (true) {
        case !!image:
          imageElement = `<div class="card-image">
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
      }
      mainElement = `
          <div class="card ${imageAttribute} ${slugPageAttribute}">
            ${imageElement}
            <div class="card-content">
              ${mainElement}
            </div>
          </div>
        `
    }
    if (online !== false) {
      mainElement = `<a href="${urlFilter(page.url)}" class="${itemClassName}">${mainElement}</a>`
    }
    return `
      <li>
        ${mainElement}
        ${abstractText}
        ${children}
      </li>
    `
  }
}
