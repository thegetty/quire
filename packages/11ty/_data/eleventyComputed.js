/**
 * Global computed data
 */
module.exports = {
  navigation: {
    id: (data) => data.title,
    parent: (data) => data.parent
  }
}
