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
module.exports = function (eleventyConfig, params) {
  /**
   * @todo move "pageLabelDivider" transfomration into a shortcode and remove "config" from params
   */
  const { className, config, page, imageDir } = params

  const {
    abstract,
    contributors: pageContributors,
    figure: pageFigure,
    image,
    label,
    layout,
    object: pageObject,
    short_title,
    summary,
    title,
    url,
    weight,
  } = page

  const contentsImage = eleventyConfig.getFilter('contentsImage')
  const contributorList = eleventyConfig.getFilter('contributorList')
  const getFigure = eleventyConfig.getFilter('getFigure')
  const getObject = eleventyConfig.getFilter('getObject')
  const markdownify = eleventyConfig.getFilter('markdownify')
  const pageTitlePartial = eleventyConfig.getFilter('pageTitle')
  const qicon = eleventyConfig.getFilter('qicon')
  const url = eleventyConfig.getFilter('url')

  const brief = className.includes('brief')
  const grid = className.includes('grid')

  // const itemClassName = weight < pageOne.data.weight ? "frontmatter-page" : ""
  const itemClassName = ''
  const pageContributorsElement = pageContributors
    ? `<span class="contributor"> — ${contributorList({ contributors: pageContributors })}</span>`
    : ''
  let pageTitle = label ? label + config.params.pageLabelDivider : ''
  if (short_title && brief) {
    pageTitle += short_title
  } else if (brief) {
    pageTitle += title
  } else {
    pageTitle += oneLine`${pageTitlePartial(page)}${pageContributorsElement}`
  }
  const arrowIcon = `<span class="arrow remove-from-epub">&nbsp${qicon("arrow-forward", "")}</span>`

  // Returns abstract with any links stripped out
  const abstractText =
    className === 'abstract' && (abstract || summary)
      ? `<div class="abstract-text">
          {{ markdownify(abstract) | replaceRE "</?a(|\\s*[^>]+)>" "" | strip_html }}
      </div>`
      : ""

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
          imageElement = firstFigure ? contentsImage({ imageDir, src: firstFigure.src }) : ''
          break
        case !!pageObject:
          const firstObjectId = pageObject[0].id
          const object = getObject(firstObjectId)
          const firstObjectFigure = object ? getFigure(object.figure[0].id) : null
          imageElement = firstObjectFigure ? contentsImage({ imageDir, src: firstObjectFigure.src }) : ''
          break
        default:
          imageElement = ''
      }
      mainElement = `
        <a href="${url(url)}" class="${itemClassName}">
          <div class="card ${imageAttribute} ${slugPageAttribute}">
            ${imageElement}
            <div class="card-content">
              <div class="title">
                ${markdownify(pageTitle)}
                ${arrowIcon}
              </div>
            </div>
          </div>
        </a>`
    } else {
      mainElement = `
        <div class="title">
          <a href="${url(url)}" class="${itemClassName}">
            ${markdownify(pageTitle)}
            ${arrowIcon}
          </a>
        </div>
        ${abstractText}
      `
    }
  return mainElement
}
