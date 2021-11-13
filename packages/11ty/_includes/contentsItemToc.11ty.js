const contentsImage = require('./contentsImage.11ty.js')
const pageTitlePartial = require('./page/title.11ty.js')
module.exports = function ({ markdownify, qicon, url }, data, page) {
  const { config, class: contentsPageClass, figures, imageDir, objects } = data

  const brief = contentsPageClass.includes('brief')
  const grid = contentsPageClass.includes('grid')

  // const itemClassName = page.data.weight < pageOne.data.weight ? "frontmatter-page" : ""
  const itemClassName = ''

  // const pageContributors = page.data.contributor
  // ? `<span class="contributor"> — {{ partial "contributor-list.html" (dict "range" page.data.contributor "contributorType" "all" "listType" "string" "Site" .Site) }}
  //   </span>`
  // : ""
  const pageContributors = ''
  let pageTitle = page.data.label ? page.data.label + config.params.pageLabelDivider : ''
  if (page.data.short_title && brief) {
    pageTitle += page.data.short_title
  } else if (brief) {
    pageTitle += page.data.title
  } else {
    pageTitle += `${pageTitlePartial(page)}${pageContributors}`
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
      let imageElement
      switch (true) {
        case !!page.data.figure:
          imageElement = `<div class="card-image">
              <figure class="image">
                <img src="{{ $imgPath | relURL }}" alt="" />
              </figure>
            </div>`
          break
        case !!page.data.object:
          let firstPageFigure = page.data.object.map((object) => {
            if (object.id) {
              return objects.object_list.find(({ id }) => id === object.id)
                .figure[0]
            } else if (object.figure) {
              return object.figure[0]
            }
          })[0]
          if (firstPageFigure.id) {
            firstPageFigure = figures.figure_list.find(
              ({ id }) => id === firstPageFigure.id
            )
          }
          imageElement = contentsImage(data, firstPageFigure)
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
