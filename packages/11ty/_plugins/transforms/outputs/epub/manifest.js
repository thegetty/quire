const chalkFactory = require('~lib/chalk')
const path = require('path')

const logger = chalkFactory('_plugins:epub:manifest')

/**
 * Returns publication.yaml data as JSON for the EPUB generation library
 *
 * @param  {Object} publication
 * @return {Object}
 */
module.exports = (eleventyConfig) => {
  const removeHTML = eleventyConfig.getFilter('removeHTML')
  const sortByKeys = eleventyConfig.getFilter('sortByKeys')

  const { assets, readingOrder } = eleventyConfig.globalData.epub

  const {
    contributor,
    copyright,
    description,
    isbn,
    language,
    promo_image: promoImage,
    pub_date: pubDate,
    publishers,
    readingLine,
    subtitle,
    title
  } = eleventyConfig.globalData.publication
  const { epub, figures: { imageDir } } = eleventyConfig.globalData.config

  /**
   * Contributor name, filtered by type
   */
  const contributors = (type) => {
    if (!contributor) return
    const contributors = contributor.filter((item) => item.type === type)

    return contributors.map(({ first_name, full_name, last_name, role }) => {
      const name = full_name || `${first_name} ${last_name}`
      const item = {
        name: name,
        role: `${role || 'aut'}`
      }

      if (last_name && first_name) {
        item['file-as'] = `${last_name}, ${first_name}`
      }

      return item
    })
  }

  const cover = () => {
    const image = promoImage || epub.defaultCoverImage
    if (!image) {
      logger.error(`Epub requires a cover image defined in publication.promo_image or config.epub.defaultCoverImage.`)
      return
    }
    return path.join(imageDir, image).replace(/^\//, '')
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
    return [path.join('_assets', 'epub.css')]
  }

  /**
   * Publication title, subtitle, and reading line
   */
  const pubTitle = () => {
    const separator = title.match(/[.,:!?]$/) ? '' : ':';
    switch (true) {
      case !!subtitle && !!readingLine:
        return `${title}${separator} ${subtitle} ${readingLine}`;
      case !!readingLine:
        return `${title} (${readingLine})`;
      case !!subtitle:
        return `${title}${separator} ${subtitle}`;
      default:
        return title;
    }
  }

  /**
   * Collect resources for the publication
   */
  let resources = []
  for (const url of stylesheets()) {
    resources.push({
      url: url,
      encodingFormat: 'text/css'
    })
  }

  const coverUrl = cover()
  resources.push({
    url: coverUrl,
    rel: 'cover-image'
  })
  for (const asset of assets) {
    let item = { url: asset }
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

  return {
    '@context': [
      'https://schema.org',
      'https://www.w3.org/ns/pub-context'
    ],
    conformsTo: 'https://www.w3.org/TR/pub-manifest/',
    contributors: contributors('secondary'),
    creators: contributors('primary'),
    dateModified: pubDateWithoutMs,
    description: publicationDescription,
    id: isbn,
    languages: language,
    publisher: publisherNameAndLocations(),
    readingOrder: readingOrder.sort(sortByKeys(['url'])),
    resources: resources,
    rights: copyright,
    title: pubTitle(),
    type: 'Book'
  }
}
