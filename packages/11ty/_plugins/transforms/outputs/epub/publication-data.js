const path = require('path')

/**
 * Returns publication.yaml data as JSON for the EPUB generation library
 * 
 * @param  {Object} publication
 * @return {Object}
 */
module.exports = (eleventyConfig) => {
  const removeHTML = eleventyConfig.getFilter('removeHTML')

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
    title,
    url
  } = eleventyConfig.globalData.publication
  const { baseURL, epub, params } = eleventyConfig.globalData.config

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
    return (promoImage) ? getURLforImage(promoImage): epub.defaultCover
  }

  /**
   * getURLforImage
   * 
   * @param {String} image path
   * 
   * @description When given the relative path for a image, returns the
   * appropriate URL to view the content when the preview server is running.
   */
  const getURLforImage = (image) => {
    return path.join('..', params.imageDir, image)
  }

  /**
   * Comma-separated list of publisher names and locations
   * @return {String}
   */
  const publisherNameAndLocations = () => {
    if (!publishers) return;
    return publishers.map(({ location, name }) => {
      return location ? `${name}, ${location}` : `${name}`;
    })
  }

  /**
   * Paths to stylesheets
   * @todo determine path to stylesheet
   * @returns {Array} Paths to stylesheets
   */
  const stylesheets = () => {
    return [path.join('css', 'epub.css')]
  }

  /**
   * Publication title, subtitle, and reading line
   */
  const pubTitle = () => {
    if (subtitle && readingLine) {
      return `${title}: ${subtitle} ${readingLine}`
    } else if (subtitle) {
      return `${title}: ${subtitle}`
    }
  }

  return {
    contributors: contributors('secondary'),
    cover: cover(),
    creators: contributors('primary'),
    // css: stylesheets(),
    date: pubDate,
    description: removeHTML(description.full).replace(/\r?\n|\r/g, " "),
    isbn,
    languages: language,
    publisher: publisherNameAndLocations(),
    rights: copyright,
    title: pubTitle(),
    url
  }
}
