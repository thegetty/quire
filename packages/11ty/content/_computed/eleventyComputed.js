/* eslint-disable camelcase */
import chalkFactory from '#lib/chalk/index.js'

const { warn } = chalkFactory('eleventyComputed')

/**
 * @function mapContributorPage
 *
 * @param {Object} page
 *
 * Maps a `page` object to the internal API
 *
 **/
const mapContributorPage = (page) => {
  const { data, url } = page
  const { label, subtitle, title } = data

  return {
    label,
    subtitle,
    title,
    url
  }
}

/**
 * @function isContributorPage
 *
 * @param {String} id
 * @param {Object} page
 * @param {String} except
 *
 * True if this contributor `id` is in `page`, unless page url is `except`
 *
 **/
const isContributorPage = (page, contributor, except) => {
  const { id, first_name, last_name } = contributor

  switch (true) {
    case except && page.url === except:
      return false

    case id === undefined:
      return page.data.contributor?.some((contrib) => first_name === contrib.first_name && last_name === contrib.last_name)

    default:
      return page.data.contributor?.some((contrib) => contrib.id === id)
  }
}

/**
 * @function addPages
 *
 * @param {Object} contributor
 * @param {Object} collections - 11ty Collections API object
 * @param {String|undefined} omitUrl
 *
 * Returns shallow copy of `contributor` with mapped array of contributed `pages`.
 * Omits pages published at `omitUrl`
 *
 **/
const addPages = (contributor, collections, omitUrl) => {
  const pages = collections.allSorted
    .filter((page) => isContributorPage(page, contributor, omitUrl))
    .map((page) => mapContributorPage(page))

  return { ...contributor, pages }
}

/**
 * Global computed data
 */
export default {
  canonicalURL: ({ publication, page }) => {
    const pageUrl = page.url.replace(/^\/+/, '')
    return new URL(pageUrl, publication.url).href
  },
  eleventyNavigation: {
    /**
     * Explicitly define page data properties used in the TOC
     * since eleventyNavigation does not include the entire page object
     */
    data: (data) => {
      return {
        abstract: data.abstract,
        classes: data.classes,
        contributor: data.contributor,
        figure: data.figure,
        image: data.image,
        label: data.label,
        layout: data.layout,
        object: data.object,
        order: data.order,
        page_pdf_output: data.page_pdf_output,
        short_title: data.short_title,
        subtitle: data.subtitle,
        summary: data.summary,
        title: data.title
      }
    },
    key: (data) => data.key,
    order: (data) => data.order,
    parent: (data) => data.parent,
    title: (data) => data.title,
    url: (data) => data.page.url
  },
  /**
   * Current page key
   * @return {String}
   */
  key: (data) => {
    if (!data.page.url) return
    const segments = data.page.url.split('/')
    const key = segments.slice(1, segments.length - 1).join('/')
    return data.key || key
  },
  /**
   * Classes applied to <main> page element
   */
  classes: ({ collections, classes = [], page }) => {
    const computedClasses = []
    // Add computed frontmatter and page-one classes
    const pageIndex = collections.allSorted.findIndex(({ outputPath }) => outputPath === page.outputPath)
    const pageOneIndex = collections.allSorted.findIndex(
      ({ data }) => Array.isArray(data.classes) && data.classes.includes('page-one')
    )
    if (pageIndex < pageOneIndex) {
      computedClasses.push('frontmatter')
    }
    // filter null values, handles 11ty's first pass at build
    const filteredClasses = Array.from(classes).filter((x) => x)

    // add custom classes from page frontmatter
    return computedClasses.concat(filteredClasses)
  },
  pageContributors: ({ collections, contributor, contributor_as_it_appears, page }) => {
    if (!contributor) return []

    if (contributor_as_it_appears) return contributor_as_it_appears

    if (!collections.all) {
      return contributor
    }

    return contributor.map((c) => addPages(c, collections, page?.url))
  },
  /**
   * Compute a 'pageData' property that includes the page and collection page data
   * @todo figure out how to have this override the page property
   */
  pageData: ({ collections, page }) => {
    if (!collections) return
    return collections.all.find(({ url }) => url === page.url)
  },
  /**
   * Figures data for figures referenced by id in page frontmatter
   */
  pageFigures: ({ figure, figures }) => {
    if (!figure || !figure.length) return
    return figure.map((figure) => figures.find((item) => item.id === figure.id))
  },
  /**
   * Objects data referenced by id in page frontmatter including figures data
   */
  pageObjects: function ({ figures, object, objects }) {
    if (!object || !object.length) return
    return object
      .reduce((validObjects, item) => {
        const objectData = objects.object_list && objects.object_list.length
          ? objects.object_list.find(({ id }) => id === item.id)
          : item
        if (!objectData) {
          warn(`pageObjects: no object found with id ${item.id}`)
          return validObjects
        }

        if (objectData.figure) {
          objectData.figures = objectData.figure.map((figure) => {
            if (figure.id) {
              return this.getFigure(figure.id)
            } else {
              return figure
            }
          })
          validObjects.push(objectData)
        }

        return validObjects
      }, [])
  },
  pagination: ({ collections, page }) => {
    if (!page || !collections.navigation.length) return {}
    const currentPageIndex = collections.navigation
      .findIndex(({ url }) => url === page.url)
    if (currentPageIndex === -1) return {}
    return {
      currentPage: collections.navigation[currentPageIndex],
      currentPageIndex,
      percentProgress: 100 * (currentPageIndex + 1) / collections.navigation.length,
      nextPage: collections.navigation[currentPageIndex + 1],
      previousPage: collections.navigation[currentPageIndex - 1]
    }
  },
  /**
   * Parent page key
   * @return {String}
   */
  parent: ({ page, parent }) => {
    if (!page.url) return
    const segments = page.url.split('/')
    const parentSegment = segments.slice(1, segments.length - 2).join('/')
    return parent || parentSegment
  },
  parentPage: ({ collections, parent }) => {
    return collections.all.find((item) => parent && item.data.key === parent)
  },
  /**
   * Contributors with a `pages` property containing data about the pages they contributed to
   */
  publicationContributors: ({ collections, config, page, publication }) => {
    if (!collections.all) return
    if (!publication.contributor) return []

    // NB: filter empty items (unresolved promises?) from publication.contributor
    let contributors = publication.contributor.filter(Boolean)
    const inPubData = (contrib) => !!contributors.find((c) => c.id === contrib.id || (!contrib.id && contrib.first_name === c.first_name && contrib.last_name === c.last_name))

    // Add unique'd contributors that are present in page headmatter only
    const headmatterOnly = new Map()
    collections.allSorted.flatMap((page) => {
      return (page.data.contributor ?? []).filter((c) => !inPubData(c))
    }).forEach((contributor) => {
      const { id, first_name, last_name } = contributor
      const key = id ?? `${first_name} ${last_name}`

      headmatterOnly.set(key, contributor)
    })

    contributors = contributors.concat(Array.from(headmatterOnly.values()))
      .map((c) => addPages(c, collections))

    return contributors
  }
}
