const path = require ('path')
const { oneLine } = require('common-tags')
const contentsImage = require('./contentsImage.11ty.js')
const pageTitlePartial = require('../page/title.11ty.js')

module.exports = function (eleventyConfig, globalData, data, page) {
  const { config } = globalData
  const {
    class: contentsPageClass,
    imageDir
  } = data

  const contributorList = eleventyConfig.getFilter('contributorList')
  const getFigure = eleventyConfig.getFilter('getFigure')
  const getObject = eleventyConfig.getFilter('getObject')
  const markdownify = eleventyConfig.getFilter('markdownify')
  const qicon = eleventyConfig.getFilter('qicon')
  const url = eleventyConfig.getFilter('url')

  const brief = contentsPageClass.includes('brief')
  const grid = contentsPageClass.includes('grid')

  // const itemClassName = page.data.weight < pageOne.data.weight ? "frontmatter-page" : ""
  const itemClassName = ''
  const pageContributors = page.data.contributor
  ? `<span class="contributor"> — ${contributorList(page.data.contributor, 'all', 'string')}</span>`
  : ""
  let pageTitle = page.data.label ? page.data.label + config.params.pageLabelDivider : ''
  if (page.data.short_title && brief) {
    pageTitle += page.data.short_title
  } else if (brief) {
    pageTitle += page.data.title
  } else {
    pageTitle += oneLine`${pageTitlePartial(page)}${pageContributors}`
  }
  const arrowIcon = `<span class="arrow remove-from-epub">&nbsp${qicon("arrow-forward", "")}</span>`

  // Returns abstract with any links stripped out
  const abstract =
    contentsPageClass === 'abstract' && (page.data.abstract || page.data.summary)
      ? `<div class="abstract-text">
          {{ markdownify(page.data.abstract) | replaceRE "</?a(|\\s*[^>]+)>" "" | strip_html }}
      </div>`
      : ""

    let mainElement

    if (grid) {
      const imageAttribute = page.data.figure || page.data.object ? "image" : "no-image"
      const slugPageAttribute = page.data.layout === 'contents' ? "slug-page" : ""
      let figure
      let imageElement
      switch (true) {
        case !!page.data.image:
          imageElement = `<div class="card-image">
              <figure class="image">
                <img src="${path.join(imageDir, page.image)}" alt="" />
              </figure>
            </div>`
          break
        case !!page.data.figure:
          const firstFigure = firstPageFigure ? getFigure(page.data.figure[0]) : null
          imageElement = firstFigure ? contentsImage(data, firstFigure) : ''
          break
        case !!page.data.object:
          const firstObjectId = page.data.object[0].id
          const object = getObject(firstObjectId)
          const firstObjectFigure = object ? getFigure(object.figure[0].id) : null
          imageElement = firstObjectFigure ? contentsImage(data, firstObjectFigure) : ''
          break
        default:
          imageElement = ''
      }
      mainElement = `
        <a href="${url(page.url)}" class="${itemClassName}">
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
          <a href="${url(page.url)}" class="${itemClassName}">
            ${markdownify(pageTitle)}
            ${arrowIcon}
          </a>
        </div>
        ${abstract}
      `
    }
  return mainElement
}
