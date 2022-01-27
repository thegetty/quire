module.exports = function({ globalData }) {
  const { publication } = globalData
  return new Date(publication.pub_date).getFullYear()
}
