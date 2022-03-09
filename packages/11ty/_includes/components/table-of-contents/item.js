const path = require ('path')
const { oneLine } = require('common-tags')

/**
 * Renders a TOC item
 *
 * @param     {Object} context
 * @param     {String} params
 * @property  {String} className - The TOC page class, "grid", "brief", or "abstract"
 * @property  {String} config - The global config
 * @property  {String} imageDir - The computed imageDir property
 * @property  {String} page - The TOC item's page data
 *
 * @return {String} TOC item markup
 */
module.exports = function (eleventyConfig, globalData) {
  const contributorList = eleventyConfig.getFilter('contributorList')
  const getFigure = eleventyConfig.getFilter('getFigure')
  const getObject = eleventyConfig.getFilter('getObject')
  const icon = eleventyConfig.getFilter('icon')
  const markdownify = eleventyConfig.getFilter('markdownify')
  const pageTitle = eleventyConfig.getFilter('pageTitle')
  const tableOfContentsImage = eleventyConfig.getFilter('tableOfContentsImage')
  const urlFilter = eleventyConfig.getFilter('url')
  const { imageDir } = globalData.config.params

  return function (params) {
    /**
     * @todo move "pageLabelDivider" transfomration into a shortcode and remove "config" from params
     */
    const { className, config, page } = params

    const {
      abstract,
      data,
      figure: pageFigure,
      layout,
      summary,
      url
    } = page

    const {
      contributor: pageContributors,
      image,
      label,
      object: pageObject,
      short_title,
      title,
      weight
    } = data

    const brief = className.includes('brief')
    const grid = className.includes('grid')

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
      pageTitleElement += oneLine`${pageTitle({ page: page.data, withLabel: true })}${pageContributorsElement}`
    }
    const arrowIcon = `<span class="arrow remove-from-epub">&nbsp${icon({ type: 'arrow-forward', description: '' })}</span>`

    // Returns abstract with any links stripped out
    const abstractText =
      className === 'abstract' && (abstract || summary)
        ? `<div class="abstract-text">
            {{ markdownify(abstract) | replaceRE "</?a(|\\s*[^>]+)>" "" | strip_html }}
        </div>`
        : ''

    let mainElement

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
        <a href="${urlFilter(url)}" class="${itemClassName}">
          <div class="card ${imageAttribute} ${slugPageAttribute}">
            ${imageElement}
            <div class="card-content">
              <div class="title">
                ${markdownify(pageTitleElement)}
                ${arrowIcon}
              </div>
            </div>
          </div>
        </a>`
    } else {
      mainElement = `
        <div class="title">
          <a href="${urlFilter(url)}" class="${itemClassName}">
            ${markdownify(pageTitleElement)}
            ${arrowIcon}
          </a>
        </div>
        ${abstractText}
      `
    }
    return mainElement
  }
}
