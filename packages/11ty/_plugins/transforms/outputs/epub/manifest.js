/* eslint-disable camelcase */

import chalkFactory from '#lib/chalk/index.js'
import path from 'node:path'

const logger = chalkFactory('_plugins:epub:manifest')

/**
 * Returns publication.yaml data as JSON for the EPUB generation library
 *
 * @param  {Object} publication
 * @return {Object}
 */
export default (eleventyConfig) => {
  const getFigureMedia = eleventyConfig.getFilter('getFigureMedia')
  const removeHTML = eleventyConfig.getFilter('removeHTML')
  const sortByKeys = eleventyConfig.getFilter('sortByKeys')

  const { assets, readingOrder } = eleventyConfig.globalData.epub

  const {
    contributor,
    copyright,
    description,
    isbn,
    language,
    pub_date: pubDate,
    publishers,
    readingLine,
    subtitle,
    title
  } = eleventyConfig.globalData.publication
  const { accessibilityMetadata } = eleventyConfig.globalData.config

  /**
   * Contributor name, filtered by type
   */
  const contributors = (type) => {
    if (!contributor) return
    const contributors = contributor.filter((item) => item.type === type)

    return contributors.map(({ first_name, full_name, last_name, role }) => {
      const name = full_name || `${first_name} ${last_name}`
      const item = {
        name,
        role: `${role || 'aut'}`
      }

      if (last_name && first_name) {
        item['file-as'] = `${last_name}, ${first_name}`
      }

      return item
    })
  }

  const cover = () => {
    const promoFigure = getFigureMedia('promo-image')
    const epubDefaultImage = getFigureMedia('epub-default')

    // Use the internal path to align disk file paths correctly
    const coverPath = promoFigure ? promoFigure.derivatives.full.paths.internal : epubDefaultImage.derivatives.full.paths.internal
    if (!coverPath) {
      logger.error('Epub requires a cover image defined in publication.promo_image or config.epub.defaultCoverImage.')
      return
    }

    // Remove leading absolute pathing so it works correctly in epub package
    const relative = path.posix.relative('/', coverPath)
    return relative
  }

  /**
   * Comma-separated list of publisher names and locations
   * @return {String}
   */
  const publisherNameAndLocations = () => {
    if (!publishers) return
    return publishers.map(({ location, name }) => {
      return location ? `${name}, ${location}` : `${name}`
    })
  }

  /**
   * Paths to stylesheets
   * @todo determine path to stylesheet
   * @returns {Array} Paths to stylesheets
   */
  const stylesheets = () => {
    return [path.posix.join('_assets', 'epub.css')]
  }

  /**
   * Publication title, subtitle, and reading line
   */
  const pubTitle = () => {
    const separator = title.match(/[.,:!?]$/) ? '' : ':'
    switch (true) {
      case !!subtitle && !!readingLine:
        return `${title}${separator} ${subtitle} ${readingLine}`
      case !!readingLine:
        return `${title} (${readingLine})`
      case !!subtitle:
        return `${title}${separator} ${subtitle}`
      default:
        return title
    }
  }

  /**
   * Collect resources for the publication
   */
  const resources = []
  for (const url of stylesheets()) {
    resources.push({
      url,
      encodingFormat: 'text/css'
    })
  }

  const coverUrl = cover()
  resources.push({
    url: coverUrl,
    rel: 'cover-image'
  })
  for (const asset of assets) {
    const item = { url: asset }
    resources.push(item)
  }

  const { full, one_line: oneLine } = description
  const publicationDescription = full
    ? removeHTML(full).replace(/\r?\n|\r/g, ' ')
    : oneLine

  /**
   * Strip milliseconds from ISO date string (`.sss`)
   */
  const pubDateWithoutMs = pubDate
    .toISOString()
    .replace(/\.\d{3}/, '')

  /**
   * Accessibility metadata with defaults per EPUB accessibility standards
   */
  const {
    accessibilitySummary = 'This publications meets baseline accessibility standards',
    accessMode = ['textual', 'visual'],
    accessModeSufficient = ['textual,visual', 'textual'],
    accessibilityFeature = ['unknown'],
    accessibilityHazard = ['unknown']
  } = accessibilityMetadata || {}

  return {
    '@context': [
      'https://schema.org',
      'https://www.w3.org/ns/pub-context'
    ],
    accessibilitySummary,
    accessMode,
    accessModeSufficient,
    accessibilityFeature,
    accessibilityHazard,
    conformsTo: 'https://www.w3.org/TR/pub-manifest/',
    contributors: contributors('secondary'),
    creators: contributors('primary'),
    dateModified: pubDateWithoutMs,
    description: publicationDescription,
    id: isbn,
    languages: language,
    publisher: publisherNameAndLocations(),
    readingOrder: readingOrder.sort(sortByKeys(['url'])),
    resources,
    rights: copyright,
    title: pubTitle(),
    type: 'Book'
  }
}
