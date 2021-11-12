const path = require('path')
/**
 * Global computed data
 */
module.exports = {
  canonicalURL: ({ config, page }) => path.join(config.baseURL, page.url),
  data: (data) => data,
  // imageDir: ({ config }) => path.join(config.baseURL, config.params.imageDir),
  imageDir: '/_assets/img/',
  navigation: {
    id: (data) => data.title,
    parent: (data) => data.parent
  }
}
