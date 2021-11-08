/**
 * Global computed data
 */
module.exports = {
  canonicalURL: ({ config, url }) => `${config.baseURL}${url}`,
  data: (data) => data,
  navigation: {
    id: (data) => data.title,
    parent: (data) => data.parent
  }
}