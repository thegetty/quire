/**
 * This controls the various navigation elements (nav, skip-link, menu and
 * search icons, and search results if enabled). It is visible on all pages.
 *
 * A note that while Hugo includes .Next and .Prev variables that can be used
 * to connect to the next and previous pages in the linear order of the site,
 * Quire makes available the option of hiding pages from the linear order in the
 * book in order to have custom pages in other formats (PDF, EPUB, etc.).
 * Because of this, the .Next and .Prev variables are not used here, and instead
 * eligible pages are ranged through and based on weight, the next or previous
 * one in the range is linked to.
 */
module.exports = function(data) {
  const { collections, config, page } = data

  const { imageDir, pageLabelDivider } = config.params

  /**
   * A sorted list of all pages
   * @TODO refactor this hacky pages/nextPage/previousPage stuff to use Eleventy pagination https://www.11ty.dev/docs/pagination/nav/
   */
  const pages = collections.all
    .sort((a, b) => a.data.weight - b.data.weight)
    .filter(({ type, url }) => type !== 'data' &&
      url !== '/cover/' && // handles duplicate `/cover/`, `/` routes with added `index.md`
      url !== '/catalogue/catalogue-index/' // handles duplicate `/catalogue/catalogue-index`, `/catalogue/`, routes with added `/catalogue/index.md`
    )

  const currentPageIndex = pages.findIndex(({ url }) => url === page.url)

  const previousPage = currentPageIndex > 0
    ? pages[currentPageIndex - 1]
    : null

  const nextPage = (
    currentPageIndex > 0 &&
    currentPageIndex < pages.length - 1
  )
    ? pages[currentPageIndex + 1]
    : null

  const home = '/'
  const isHomePage = page.url === home

  // @TODO figure out js module-friendly filters @see ./menu-header.11ty.js
  const markdownify = (input) => input ? input : ''
  // @TODO figure out js module-friendly filters -- this one should work though
  const truncate = (text, limit) => text.slice(0, limit)

  const navBarStartButton = () => {
    if (!isHomePage) return ''
    const secondPageLink = pages[1].url
    return `
      <li class="quire-navbar-page-controls__item quire-home-page">
        <a href="${secondPageLink}" rel="next">
          <span class="visually-hidden">Next Page: </span>
          <span class="quire-navbar-button play-button">
            <svg class="remove-from-epub">
              <switch>
                <use xlink:href="#start-icon"></use>
                <foreignObject width="32" height="32">
                  <img src="${imageDir}/icons/play.png" alt="Next Page" />
                </foreignObject>
              </switch>
            </svg>
          </span>
        </a>
      </li>
    `
  }

  const navBarPreviousButton = () => {
    if (!previousPage) return ''
    const { label, short_title, title, url } = previousPage
    return `
      <li class="quire-navbar-page-controls__item quire-previous-page">
        <a href="${url}" rel="previous">
          <span class="visually-hidden">Previous Page: </span>
          <svg class="left-icon remove-from-epub">
            <switch>
              <use xlink:href="#left-arrow-icon"></use>
              <foreignObject width="24" height="24">
                <img src="${imageDir}/icons/left-arrow.png" alt="Previous Page" />
              </foreignObject>
            </switch>
          </svg>
          <span class="nav-label">${ label ? label + pageLabelDivider : ''}${short_title ? markdownify(short_title) : truncate(markdownify(title), 34)}</span>
        </a>
      </li>
    `
  }

  const navBarHomeButton = () => {
    if (!previousPage) return ''
    return `
      <li class="quire-navbar-page-controls__item quire-home-page">
        <a href="${home}" rel="home">
          <span class="visually-hidden">Home Page: </span>
          <span class="quire-navbar-button home-button">
            <svg class="remove-from-epub">
              <switch>
                <use xlink:href="#home-icon"></use>
                <foreignObject width="32" height="32">
                  <img src="${imageDir}/icons/home.png" alt="Home Page" />
                </foreignObject>
              </switch>
            </svg>
          </span>
        </a>
      </li>
    `
  }

  const navBarNextButton = () => {
    if (isHomePage || !nextPage) return ''
    const { label, short_title, title, url } = nextPage
    return `
      <li class="quire-navbar-page-controls__item quire-next-page">
        <a href="${url}" rel='next'>
          <span class="visually-hidden">Next Page: </span>
          <span class="nav-label">${ label ? label + pageLabelDivider : ''}${short_title ? markdownify(short_title) : truncate(markdownify(title), 34)}</span>
          <svg class="remove-from-epub">
            <switch>
              <use xlink:href="#right-arrow-icon"></use>
              <foreignObject width="24" height="24">
                <img src="${imageDir}/icons/right-arrow.png" alt="Next Page" />
              </foreignObject>
            </switch>
          </svg>
        </a>
      </li>
    `
  }

  return `
    <div class="quire-navbar">

      <a href="#main" class="quire-navbar-skip-link" tabindex="1">
        Skip to Main Content
      </a>

      <nav class="quire-navbar-controls">
        <div class="quire-navbar-controls__left">
          <button
            class="quire-navbar-button search-button"
            aria-controls="quire-search"
            onclick="toggleSearch()"
          >
            <svg class="remove-from-epub">
              <switch>
                <use xlink:href="#search-icon"></use>
                <foreignObject width="32" height="32">
                  <img src="${imageDir}/icons/search.png" alt="Search" />
                </foreignObject>
              </switch>
            </svg>
            <span class="visually-hidden">Search</span>
          </button>
        </div>

        <div class="quire-navbar-controls__center">
          <ul class="quire-navbar-page-controls" role="navigation" aria-label="quick">

            ${navBarStartButton()}
            ${navBarPreviousButton()}
            ${navBarHomeButton()}
            ${navBarNextButton()}

          </ul>
        </div>

        <div class="quire-navbar-controls__right">
          <button
            class="quire-navbar-button menu-button"
            id="quire-controls-menu-button"
            onclick="toggleMenu()"
            aria-expanded="true"
            aria-controls="quire-menu"
            tabindex="2"
          >
            <svg class="remove-from-epub">
              <switch>
                <use xlink:href="#nav-icon"></use>
                <foreignObject width="32" height="32">
                  <img src="${imageDir}/icons/nav.png" alt="Table of Contents" />
                </foreignObject>
              </switch>
            </svg>
            <span class="visually-hidden">Table of Contents</span>
          </button>
        </div>
      </nav>

      <div class="quire-progress-bar">
        <!--
        {{ $len := len $pages }}
        {{ range $index, $element := $pages }}
          {{ if eq . $.Page }}
            <div style="width: calc(100% * ({{ add $index 1 }} / {{ $len }}));">
              <span>{{ add $index 1 }}/{{ $len }}</span>
            </div>
          {{ end }}
        {{ end }}
        -->
      </div>

    </div>
  `
}
