module.exports = function({ collections }) {
  return JSON.stringify(this.search(collections.all))
}