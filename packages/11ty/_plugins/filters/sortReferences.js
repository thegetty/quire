module.exports = function (items) {
  if (!items || !Array.isArray(items)) return null

  return items.sort((a, b) => {
    const sortA = a.sort_as || a.full
    const sortB = b.sort_as || b.full

    switch (true) {
      case (sortA < sortB):
        return -1;
      case (sortA > sortB):
        return 1;
      default:
        return 0
    }
  })
}
