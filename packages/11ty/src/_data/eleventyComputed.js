const path = require('path')
/**
 * Global computed data
 */
module.exports = {
  canonicalURL: ({ config, page }) => path.join(config.baseURL, page.url),
  imageDir: ({ config }) => path.join(config.baseURL, config.params.imageDir),
  data: (data) => data,
  navigation: {
    id: (data) => data.title,
    parent: (data) => data.parent
  }
}